import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

// Temporary in-memory store (we’ll replace with PostgreSQL later)
const users: any[] = [];

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        // 1️⃣ Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // 2️⃣ Check for duplicate email
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            role: role || "member",
        };

        users.push(newUser);

        return res.status(201).json({ message: "User registered" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
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