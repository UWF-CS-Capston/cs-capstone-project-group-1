import { Router } from "express";
import { query } from "../db";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

const promoteNextQueuedUser = async (machineId: string | number) => {
    const nextUser = await query<{ id: number; user_id: number }>(
        `
        SELECT id, user_id
        FROM machine_queue
        WHERE machine_id = $1
        ORDER BY created_at ASC, id ASC
        LIMIT 1
        `,
        [machineId]
    );

    const nextEntry = nextUser.rows[0];
    if (!nextEntry) {
        return null;
    }

    await query(
        `
        DELETE FROM machine_queue
        WHERE id = $1
        `,
        [nextEntry.id]
    );

    await query(
        `
        INSERT INTO machine_usage (machine_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (machine_id)
        DO UPDATE SET
            user_id = EXCLUDED.user_id,
            started_at = NOW()
        `,
        [machineId, nextEntry.user_id]
    );

    return nextEntry.user_id;
};

router.get("/", async (_req, res) => {
    try {
        const result = await query(
            `
            SELECT
                m.id,
                m.name,
                COUNT(q.id) AS queue_count,
                active_user.email AS active_user_email,
                usage.started_at AS active_started_at
            FROM machines m
            LEFT JOIN machine_queue q
                ON q.machine_id = m.id
            LEFT JOIN machine_usage usage
                ON usage.machine_id = m.id
            LEFT JOIN users active_user
                ON active_user.id = usage.user_id
            GROUP BY m.id, m.name, active_user.email, usage.started_at
            ORDER BY m.id
            `
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Machine fetch error:", err);
        res.status(500).json({ message: "Failed to fetch machines" });
    }
});

router.get("/:machineId/details", authenticate, async (req, res) => {
    const userId = (req as any).user.userId;
    const machineId = String(req.params.machineId);

    try {
        const machineResult = await query<{ id: number; name: string }>(
            `
            SELECT id, name
            FROM machines
            WHERE id = $1
            LIMIT 1
            `,
            [machineId]
        );

        const machine = machineResult.rows[0];
        if (!machine) {
            return res.status(404).json({ message: "Machine not found" });
        }

        const activeResult = await query<{
            user_id: number;
            email: string;
            started_at: string;
            active_seconds: number;
        }>(
            `
            SELECT
                u.id AS user_id,
                u.email,
                usage.started_at,
                FLOOR(EXTRACT(EPOCH FROM (NOW() - usage.started_at)))::int AS active_seconds
            FROM machine_usage usage
            JOIN users u
                ON u.id = usage.user_id
            WHERE usage.machine_id = $1
            LIMIT 1
            `,
            [machineId]
        );

        const queueResult = await query<{
            user_id: number;
            email: string;
            joined_at: string;
            wait_seconds: number;
            position: number;
        }>(
            `
            SELECT
                q.user_id,
                u.email,
                q.created_at AS joined_at,
                FLOOR(EXTRACT(EPOCH FROM (NOW() - q.created_at)))::int AS wait_seconds,
                ROW_NUMBER() OVER (
                    PARTITION BY q.machine_id
                    ORDER BY q.created_at ASC, q.id ASC
                )::int AS position
            FROM machine_queue q
            JOIN users u
                ON u.id = q.user_id
            WHERE q.machine_id = $1
            ORDER BY q.created_at ASC, q.id ASC
            `,
            [machineId]
        );

        const currentQueueEntry = queueResult.rows.find((entry) => entry.user_id === userId) ?? null;
        const activeUser = activeResult.rows[0] ?? null;
        const isUsing = activeUser?.user_id === userId;

        res.json({
            machine,
            activeUser,
            queue: queueResult.rows,
            currentUserQueue: currentQueueEntry,
            currentUserUsing: isUsing
                ? {
                    active_seconds: activeUser?.active_seconds ?? 0,
                    started_at: activeUser?.started_at ?? null,
                }
                : null,
        });
    } catch (err) {
        console.error("Machine details error:", err);
        res.status(500).json({ message: "Failed to fetch machine details" });
    }
});

router.post("/:machineId/join", authenticate, async (req, res) => {
    const userId = (req as any).user.userId;
    const machineId = String(req.params.machineId);

    try {
        const currentUsage = await query<{ user_id: number }>(
            `
            SELECT user_id
            FROM machine_usage
            WHERE machine_id = $1
            LIMIT 1
            `,
            [machineId]
        );

        if (currentUsage.rows[0]?.user_id === userId) {
            return res.status(400).json({
                message: "You are already using this machine",
            });
        }

        const existing = await query(
            `
            SELECT id
            FROM machine_queue
            WHERE machine_id = $1 AND user_id = $2
            `,
            [machineId, userId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                message: "Already in queue for this machine",
            });
        }

        if (currentUsage.rows.length === 0) {
            await query(
                `
                INSERT INTO machine_usage (machine_id, user_id)
                VALUES ($1, $2)
                `,
                [machineId, userId]
            );

            return res.json({
                message: "You are now using this machine",
                isUsing: true,
                position: null,
            });
        }

        await query(
            `
            INSERT INTO machine_queue (machine_id, user_id)
            VALUES ($1, $2)
            `,
            [machineId, userId]
        );

        const pos = await query<{ position: number }>(
            `
            SELECT position
            FROM (
                SELECT
                    user_id,
                    ROW_NUMBER() OVER (
                        PARTITION BY machine_id
                        ORDER BY created_at ASC, id ASC
                    )::int AS position
                FROM machine_queue
                WHERE machine_id = $1
            ) ranked
            WHERE user_id = $2
            LIMIT 1
            `,
            [machineId, userId]
        );

        res.json({
            message: "Joined queue",
            isUsing: false,
            position: pos.rows[0]?.position ?? null,
        });
    } catch (err) {
        console.error("Queue join error:", err);
        res.status(500).json({ message: "Failed to join queue" });
    }
});

router.post("/:machineId/leave", authenticate, async (req, res) => {
    const userId = (req as any).user.userId;
    const machineId = String(req.params.machineId);

    try {
        const activeUsage = await query<{ user_id: number }>(
            `
            SELECT user_id
            FROM machine_usage
            WHERE machine_id = $1
            LIMIT 1
            `,
            [machineId]
        );

        if (activeUsage.rows[0]?.user_id === userId) {
            await query(
                `
                DELETE FROM machine_usage
                WHERE machine_id = $1 AND user_id = $2
                `,
                [machineId, userId]
            );

            const promotedUserId = await promoteNextQueuedUser(machineId);

            return res.json({
                message: promotedUserId
                    ? "Stopped using machine and promoted the next user"
                    : "Stopped using machine",
            });
        }

        await query(
            `
            DELETE FROM machine_queue
            WHERE machine_id = $1 AND user_id = $2
            `,
            [machineId, userId]
        );

        res.json({ message: "Left queue" });
    } catch (err) {
        console.error("Queue leave error:", err);
        res.status(500).json({ message: "Failed to leave queue" });
    }
});

router.get("/:machineId/position", authenticate, async (req, res) => {
    const userId = (req as any).user.userId;
    const machineId = String(req.params.machineId);

    try {
        const activeUsage = await query<{ started_at: string }>(
            `
            SELECT started_at
            FROM machine_usage
            WHERE machine_id = $1 AND user_id = $2
            LIMIT 1
            `,
            [machineId, userId]
        );

        if (activeUsage.rows.length > 0) {
            return res.json({
                position: null,
                isUsing: true,
                startedAt: activeUsage.rows[0].started_at,
            });
        }

        const result = await query<{ position: number; joined_at: string }>(
            `
            SELECT position, joined_at
            FROM (
                SELECT
                    user_id,
                    created_at AS joined_at,
                    ROW_NUMBER() OVER (
                        PARTITION BY machine_id
                        ORDER BY created_at ASC, id ASC
                    )::int AS position
                FROM machine_queue
                WHERE machine_id = $1
            ) ranked
            WHERE user_id = $2
            LIMIT 1
            `,
            [machineId, userId]
        );

        if (result.rows.length === 0) {
            return res.json({ position: null, isUsing: false });
        }

        res.json({
            position: result.rows[0].position,
            isUsing: false,
            joinedAt: result.rows[0].joined_at,
        });
    } catch (err) {
        console.error("Position error:", err);
        res.status(500).json({ message: "Failed to get position" });
    }
});

router.post(
    "/",
    authenticate,
    authorize(["admin"]),
    async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Machine name required" });
        }

        try {
            const result = await query(
                `
                INSERT INTO machines (name)
                VALUES ($1)
                RETURNING id, name
                `,
                [name]
            );

            res.json(result.rows[0]);
        } catch (err) {
            console.error("Machine create error:", err);
            res.status(500).json({ message: "Failed to create machine" });
        }
    }
);

export default router;
