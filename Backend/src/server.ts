import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { authenticate, authorize } from "./middleware/authMiddleware";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/protected", authenticate, (req, res) => {
    res.json({ message: "You accessed a protected route!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get(
    "/api/staff-only",
    authenticate,
    authorize(["staff", "admin"]),
    (req, res) => {
        res.json({ message: "Staff access granted" });
    }
);