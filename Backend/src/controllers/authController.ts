import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

// Temporary in-memory store (we’ll replace with PostgreSQL later)
const users: any[] = [];

export const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        role: role || "member", // default role
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