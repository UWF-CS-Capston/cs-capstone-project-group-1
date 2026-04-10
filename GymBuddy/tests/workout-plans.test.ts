import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import jwt from 'jsonwebtoken';
import request from "supertest";
import app from "../src/actions/server";

const createToken = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET not set in test environment");
    }

    return jwt.sign({ userId: 999999, role: "member" }, secret, {
        expiresIn: "1h",
    });
};

describe("Workout plans endpoint", () => {
    it("should reject unauthenticated requests", async () => {
        const res = await request(app).get("/api/workout-plans");

        expect(res.statusCode).toBe(401);
    });

    it("should reject plans without a title", async () => {
        const token = createToken();

        const res = await request(app)
            .post("/api/workout-plans")
            .set("Authorization", `Bearer ${token}`)
            .send({
                workouts: [
                    {
                        exerciseName: "Bench Press",
                        sets: 3,
                        reps: 10,
                    },
                ],
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Workout plan title is required");
    });

    it("should reject plans without workouts", async () => {
        const token = createToken();

        const res = await request(app)
            .post("/api/workout-plans")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Upper Body Day",
                workouts: [],
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("At least one workout is required");
    });
});