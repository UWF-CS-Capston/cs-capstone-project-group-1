import { Router } from "express";
import { query } from "../db";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

/*
GET all machines with queue count
*/
router.get("/", async (req, res) => {
    try {
        const result = await query(
            `
            SELECT 
                m.id,
                m.name,
                COUNT(q.id) AS queue_count
            FROM machines m
            LEFT JOIN machine_queue q
                ON q.machine_id = m.id
            GROUP BY m.id
            ORDER BY m.id
            `
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Machine fetch error:", err);
        res.status(500).json({ message: "Failed to fetch machines" });
    }
});

/*
Join machine queue
*/
router.post("/:machineId/join", authenticate, async (req, res) => {
    const userId = (req as any).user.id;
    const machineId = req.params.machineId;

    try {

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
                message: "Already in queue for this machine"
            });
        }

        await query(
            `
            INSERT INTO machine_queue (machine_id, user_id)
            VALUES ($1, $2)
            `,
            [machineId, userId]
        );

        const pos = await query(
            `
            SELECT position
            FROM (
                SELECT
                    user_id,
                    ROW_NUMBER() OVER (
                        PARTITION BY machine_id
                        ORDER BY id
                    ) AS position
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
            position: pos.rows[0]?.position ?? null
        });

    } catch (err) {
        console.error("Queue join error:", err);
        res.status(500).json({ message: "Failed to join queue" });
    }
});

/*
Leave machine queue
*/
router.post("/:machineId/leave", authenticate, async (req, res) => {
    const userId = (req as any).user.id;
    const machineId = req.params.machineId;

    try {

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

/*
Get user's queue position
*/
router.get("/:machineId/position", authenticate, async (req, res) => {

    const userId = (req as any).user.id;
    const machineId = req.params.machineId;

    try {

        const result = await query(
            `
            SELECT position
                FROM (
                    SELECT
                        user_id,
                        ROW_NUMBER() OVER (
                            PARTITION BY machine_id
                            ORDER BY id
                        ) AS position
                    FROM machine_queue
                    WHERE machine_id = $1
                ) ranked
                WHERE user_id = $2
                LIMIT 1
            `,
            [machineId, userId]
        );

        if (result.rows.length === 0) {
            return res.json({ position: null });
        }

        res.json({ position: result.rows[0].position });

    } catch (err) {
        console.error("Position error:", err);
        res.status(500).json({ message: "Failed to get position" });
    }
});

/*
Admin: add machine
*/
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