import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth";
import qrRoutes from "./routes/qr";
import { authenticate, authorize } from "./middleware/authMiddleware";
import { testDatabaseConnection } from "./db";
import rateLimit from "express-rate-limit";
const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:8081",
    credentials: true,
}));
app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many auth attempts. Try again later.",
});

app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/qr", qrRoutes);

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