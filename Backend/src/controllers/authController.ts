import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import validator from "validator";

// Temporary in-memory store (we’ll replace with PostgreSQL later)
const users: any[] = [];

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

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        role: "member", // 🔥 never trust client role
    };

    users.push(newUser);

    res.status(201).json({ message: "User registered" });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id, user.role);

    res.json({ token });
};