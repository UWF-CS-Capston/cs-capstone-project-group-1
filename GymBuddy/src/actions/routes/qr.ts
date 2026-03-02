import { Router } from "express";
import { generateQR } from "../controllers/qrController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/generate", authenticate, generateQR);

export default router;