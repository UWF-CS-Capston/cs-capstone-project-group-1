import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import validator from "validator";
import { query } from "../db";
import { AuthRequest } from "../middleware/authMiddleware";

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Basic presence validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    // Email validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Strong password validation
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        return res.status(400).json({
            message: "Password must include uppercase, lowercase, number, and symbol"
        });
    }

    try {
        const existingUser = await query(
            "SELECT id FROM users WHERE email = $1 LIMIT 1",
            [email]
        );

        if (existingUser.rowCount && existingUser.rowCount > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await query(
            `INSERT INTO users (email, password_hash, role)
             VALUES ($1, $2, $3)`,
            [email, hashedPassword, "member"] 
        );

        return res.status(201).json({ message: "User registered" });
    } catch (error: any) {
        // Handle race condition on unique email constraint.
        if (error?.code === "23505") {
            return res.status(409).json({ message: "User already exists" });
        }

        return res.status(500).json({ message: "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    try {
        const result = await query(
            `SELECT id, password_hash, role
             FROM users
             WHERE email = $1
             LIMIT 1`,
            [email]
        );

        const user = result.rows[0];
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user.id, user.role);

        return res.json({ token });
    } catch {
        return res.status(400).json({ message: "Invalid credentials" });
    }
};

export const getUserInfo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        const result = await query(
            `SELECT id, email, role, created_at
             FROM users
             WHERE id = $1
             LIMIT 1`,
            [userId]
        );

        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user });
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ message: "Failed to fetch user info" });
    }
};
