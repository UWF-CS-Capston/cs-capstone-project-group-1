import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";

import authRoutes from "./routes/auth";
import qrRoutes from "./routes/qr";
import machineRoutes from "./routes/machines";
import workoutPlanRoutes from "./routes/workoutPlans";

import { authenticate, authorize } from "./middleware/authMiddleware";
import { testDatabaseConnection, pool } from "./db";
import { DerivedConfig, NetworkConfig } from "../config/network.config";

const app = express();

app.set("etag", false);

app.use(cors({
    origin: [
        ...DerivedConfig.CORS_ORIGINS,
        /\.exp\.direct$/,
    ],
    credentials: true,
}));

app.use(helmet());
app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many auth attempts. Try again later.",
});

app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/workout-plans", workoutPlanRoutes);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/protected", authenticate, (_req, res) => {
    res.json({ message: "You accessed a protected route!" });
});

app.get(
    "/api/staff-only",
    authenticate,
    authorize(["staff", "admin"]),
    (_req, res) => {
        res.json({ message: "Staff access granted" });
    }
);

const PORT = process.env.PORT || NetworkConfig.API_PORT;

const initDatabase = async () => {
    try {
        const sqlPath = path.join(__dirname, "../../../Backend/sql/init.sql");
        const initSQL = fs.readFileSync(sqlPath, "utf-8");

        await pool.query(initSQL);
        console.log("Database initialized (tables + seed data)");
    } catch (error) {
        console.error("Database init failed:", error);
        throw error;
    }
};

const startServer = async () => {
    try {
        await testDatabaseConnection();
        console.log("Connected to PostgreSQL");

        await initDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
};

export default app;

if (process.env.NODE_ENV !== "test") {
    void startServer();
}