import { Response } from "express";
import { pool, query } from "../db";
import { AuthRequest } from "../middleware/authMiddleware";

type WorkoutItemInput = {
    exerciseName?: unknown;
    name?: unknown;
    sets?: unknown;
    reps?: unknown;
    weight?: unknown;
    durationMinutes?: unknown;
    notes?: unknown;
};

type WorkoutPlanInput = {
    title?: unknown;
    workouts?: unknown;
};

type WorkoutPlanRow = {
    plan_id: number;
    title: string;
    created_at: string;
    updated_at: string;
    item_id: number | null;
    position: number | null;
    exercise_name: string | null;
    sets: number | null;
    reps: number | null;
    weight: string | number | null;
    duration_minutes: number | null;
    notes: string | null;
};

type WorkoutPlanResponse = {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    workouts: Array<{
        id: number;
        position: number;
        exerciseName: string;
        sets: number | null;
        reps: number | null;
        weight: string | number | null;
        durationMinutes: number | null;
        notes: string | null;
    }>;
};

type NormalizedWorkoutItem = {
    exerciseName: string;
    sets: number | null;
    reps: number | null;
    weight: number | null;
    durationMinutes: number | null;
    notes: string | null;
};

type WorkoutItemsResult = {
    workouts?: NormalizedWorkoutItem[];
    error?: string;
};

const isPositiveInteger = (value: unknown) =>
    typeof value === "number" && Number.isInteger(value) && value > 0;

const isNonNegativeNumber = (value: unknown) =>
    typeof value === "number" && Number.isFinite(value) && value >= 0;

const normalizeWorkoutItems = (workouts: unknown): WorkoutItemsResult => {
    if (!Array.isArray(workouts)) {
        return { error: "Workouts must be provided as an array" };
    }

    if (workouts.length === 0) {
        return { error: "At least one workout is required" };
    }

    const normalizedWorkouts: NormalizedWorkoutItem[] = [];

    for (const [index, item] of workouts.entries()) {
        if (!item || typeof item !== "object") {
            return { error: `Workout ${index + 1} must be an object` };
        }

        const workoutItem = item as WorkoutItemInput;
        const exerciseName = workoutItem.exerciseName ?? workoutItem.name;

        if (typeof exerciseName !== "string" || !exerciseName.trim()) {
            return { error: `Workout ${index + 1} is missing an exercise name` };
        }

        if (workoutItem.sets !== undefined && !isPositiveInteger(workoutItem.sets)) {
            return { error: `Workout ${index + 1} has an invalid sets value` };
        }

        if (workoutItem.reps !== undefined && !isPositiveInteger(workoutItem.reps)) {
            return { error: `Workout ${index + 1} has an invalid reps value` };
        }

        if (workoutItem.weight !== undefined && !isNonNegativeNumber(workoutItem.weight)) {
            return { error: `Workout ${index + 1} has an invalid weight value` };
        }

        if (
            workoutItem.durationMinutes !== undefined &&
            !isPositiveInteger(workoutItem.durationMinutes)
        ) {
            return { error: `Workout ${index + 1} has an invalid duration value` };
        }

        if (workoutItem.notes !== undefined && typeof workoutItem.notes !== "string") {
            return { error: `Workout ${index + 1} has invalid notes` };
        }

        normalizedWorkouts.push({
            exerciseName: exerciseName.trim(),
            sets: typeof workoutItem.sets === "number" ? workoutItem.sets : null,
            reps: typeof workoutItem.reps === "number" ? workoutItem.reps : null,
            weight: typeof workoutItem.weight === "number" ? workoutItem.weight : null,
            durationMinutes:
                typeof workoutItem.durationMinutes === "number"
                    ? workoutItem.durationMinutes
                    : null,
            notes:
                typeof workoutItem.notes === "string" && workoutItem.notes.trim()
                    ? workoutItem.notes.trim()
                    : null,
        });
    }

    return { workouts: normalizedWorkouts };
};

const validatePlanInput = (body: WorkoutPlanInput): { title?: string; workouts?: Array<{
    exerciseName: string;
    sets: number | null;
    reps: number | null;
    weight: number | null;
    durationMinutes: number | null;
    notes: string | null;
}>; error?: string } => {
    if (typeof body.title !== "string" || !body.title.trim()) {
        return { error: "Workout plan title is required" };
    }

    const workoutsResult = normalizeWorkoutItems(body.workouts);

    if (workoutsResult.error) {
        return { error: workoutsResult.error };
    }

    return {
        title: body.title.trim(),
        workouts: workoutsResult.workouts,
    };
};

const mapPlanRows = (rows: WorkoutPlanRow[]): WorkoutPlanResponse[] => {
    const planMap = new Map<number, WorkoutPlanResponse>();

    for (const row of rows) {
        if (!planMap.has(row.plan_id)) {
            planMap.set(row.plan_id, {
                id: row.plan_id,
                title: row.title,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                workouts: [],
            });
        }

        if (row.item_id !== null) {
            const plan = planMap.get(row.plan_id);

            if (plan) {
                plan.workouts.push({
                    id: row.item_id,
                    position: row.position ?? 0,
                    exerciseName: row.exercise_name ?? "",
                    sets: row.sets,
                    reps: row.reps,
                    weight: row.weight,
                    durationMinutes: row.duration_minutes,
                    notes: row.notes,
                });
            }
        }
    }

    return [...planMap.values()];
};

const loadPlanById = async (planId: number, userId: number) => {
    const result = await query<WorkoutPlanRow>(
        `
        SELECT
            p.id AS plan_id,
            p.title,
            p.created_at,
            p.updated_at,
            i.id AS item_id,
            i.position,
            i.exercise_name,
            i.sets,
            i.reps,
            i.weight,
            i.duration_minutes,
            i.notes
        FROM workout_plans p
        LEFT JOIN workout_plan_items i
            ON i.workout_plan_id = p.id
        WHERE p.id = $1
          AND p.user_id = $2
        ORDER BY i.position ASC, i.id ASC
        `,
        [planId, userId]
    );

    return mapPlanRows(result.rows)[0] ?? null;
};

export const listWorkoutPlans = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    try {
        const result = await query<WorkoutPlanRow>(
            `
            SELECT
                p.id AS plan_id,
                p.title,
                p.created_at,
                p.updated_at,
                i.id AS item_id,
                i.position,
                i.exercise_name,
                i.sets,
                i.reps,
                i.weight,
                i.duration_minutes,
                i.notes
            FROM workout_plans p
            LEFT JOIN workout_plan_items i
                ON i.workout_plan_id = p.id
            WHERE p.user_id = $1
            ORDER BY p.created_at DESC, i.position ASC, i.id ASC
            `,
            [userId]
        );

        return res.json({ plans: mapPlanRows(result.rows) });
    } catch (error) {
        console.error("Workout plan list error:", error);
        return res.status(500).json({ message: "Failed to fetch workout plans" });
    }
};

export const getWorkoutPlan = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const planId = Number(req.params.planId);

    if (!Number.isInteger(planId)) {
        return res.status(400).json({ message: "Invalid workout plan id" });
    }

    try {
        const plan = await loadPlanById(planId, userId);

        if (!plan) {
            return res.status(404).json({ message: "Workout plan not found" });
        }

        return res.json({ plan });
    } catch (error) {
        console.error("Workout plan fetch error:", error);
        return res.status(500).json({ message: "Failed to fetch workout plan" });
    }
};

export const createWorkoutPlan = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const validation = validatePlanInput(req.body as WorkoutPlanInput);

    if (validation.error) {
        return res.status(400).json({ message: validation.error });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const createdPlan = await client.query<{ id: number }>(
            `
            INSERT INTO workout_plans (user_id, title)
            VALUES ($1, $2)
            RETURNING id
            `,
            [userId, validation.title]
        );

        const planId = createdPlan.rows[0].id;

        for (const [index, workout] of validation.workouts!.entries()) {
            await client.query(
                `
                INSERT INTO workout_plan_items (
                    workout_plan_id,
                    position,
                    exercise_name,
                    sets,
                    reps,
                    weight,
                    duration_minutes,
                    notes
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `,
                [
                    planId,
                    index + 1,
                    workout.exerciseName,
                    workout.sets,
                    workout.reps,
                    workout.weight,
                    workout.durationMinutes,
                    workout.notes,
                ]
            );
        }

        await client.query("COMMIT");

        const plan = await loadPlanById(planId, userId);
        return res.status(201).json({ plan });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Workout plan create error:", error);
        return res.status(500).json({ message: "Failed to create workout plan" });
    } finally {
        client.release();
    }
};

export const updateWorkoutPlan = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const planId = Number(req.params.planId);
    const validation = validatePlanInput(req.body as WorkoutPlanInput);

    if (!Number.isInteger(planId)) {
        return res.status(400).json({ message: "Invalid workout plan id" });
    }

    if (validation.error) {
        return res.status(400).json({ message: validation.error });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const updateResult = await client.query(
            `
            UPDATE workout_plans
            SET title = $1,
                updated_at = NOW()
            WHERE id = $2
              AND user_id = $3
            RETURNING id
            `,
            [validation.title, planId, userId]
        );

        if (!updateResult.rows[0]) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Workout plan not found" });
        }

        await client.query(
            `DELETE FROM workout_plan_items WHERE workout_plan_id = $1`,
            [planId]
        );

        for (const [index, workout] of validation.workouts!.entries()) {
            await client.query(
                `
                INSERT INTO workout_plan_items (
                    workout_plan_id,
                    position,
                    exercise_name,
                    sets,
                    reps,
                    weight,
                    duration_minutes,
                    notes
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `,
                [
                    planId,
                    index + 1,
                    workout.exerciseName,
                    workout.sets,
                    workout.reps,
                    workout.weight,
                    workout.durationMinutes,
                    workout.notes,
                ]
            );
        }

        await client.query("COMMIT");

        const plan = await loadPlanById(planId, userId);
        return res.json({ plan });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Workout plan update error:", error);
        return res.status(500).json({ message: "Failed to update workout plan" });
    } finally {
        client.release();
    }
};

export const deleteWorkoutPlan = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const planId = Number(req.params.planId);

    if (!Number.isInteger(planId)) {
        return res.status(400).json({ message: "Invalid workout plan id" });
    }

    try {
        const result = await query(
            `
            DELETE FROM workout_plans
            WHERE id = $1
              AND user_id = $2
            RETURNING id
            `,
            [planId, userId]
        );

        if (!result.rows[0]) {
            return res.status(404).json({ message: "Workout plan not found" });
        }

        return res.json({ message: "Workout plan deleted" });
    } catch (error) {
        console.error("Workout plan delete error:", error);
        return res.status(500).json({ message: "Failed to delete workout plan" });
    }
};