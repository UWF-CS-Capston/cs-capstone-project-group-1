import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import qrRoutes from "./routes/qr";
import machineRoutes from "./routes/machines";

import { authenticate, authorize } from "./middleware/authMiddleware";
import { testDatabaseConnection } from "./db";
import { apiFetch } from "../utils/api";
import rateLimit from "express-rate-limit";
const app = express();

app.set("etag", false);

// src/actions/server.ts
app.use(cors({
    origin: [
        "http://localhost:8081",
        "http://192.168.1.182:8081",  // Your computer
        "http://192.168.1.162:8081",  // Your phone
        /\.exp\.direct$/                // Expo tunnel URLs
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

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/protected", authenticate, (req, res) => {
    res.json({ message: "You accessed a protected route!" });
});

app.get(
    "/api/staff-only",
    authenticate,
    authorize(["staff", "admin"]),
    (req, res) => {
        res.json({ message: "Staff access granted" });
    }
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await testDatabaseConnection();
        console.log("Connected to PostgreSQL");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to PostgreSQL", error);
        process.exit(1);
    }
};

export default app;

if (process.env.NODE_ENV !== "test") {
    void startServer();
}