import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth";
import qrRoutes from "./routes/qr";
import { authenticate, authorize } from "./middleware/authMiddleware";
import rateLimit from "express-rate-limit";

const app = express();

app.use(helmet());

// ✅ CORS MUST COME BEFORE ROUTES
app.use(
    cors({
        origin: "http://localhost:8081",
        credentials: true,
    })
);

// Explicitly handle preflight
app.options("*", cors({
    origin: "http://localhost:8081",
    credentials: true,
}));

app.options("*", cors());

app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many auth attempts. Try again later.",
});

// ✅ Now mount routes AFTER middleware
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});