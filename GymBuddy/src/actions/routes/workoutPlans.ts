import { Router } from "express";
import {
    createWorkoutPlan,
    deleteWorkoutPlan,
    getWorkoutPlan,
    listWorkoutPlans,
    updateWorkoutPlan,
} from "../controllers/workoutPlanController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, listWorkoutPlans);
router.post("/", authenticate, createWorkoutPlan);
router.get("/:planId", authenticate, getWorkoutPlan);
router.put("/:planId", authenticate, updateWorkoutPlan);
router.delete("/:planId", authenticate, deleteWorkoutPlan);

export default router;