import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment variables");
}

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId: number, role: string) => {
    return jwt.sign({ userId, role }, JWT_SECRET, {
        expiresIn: "1h",
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};