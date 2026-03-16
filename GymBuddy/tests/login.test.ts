import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("Login endpoint", () => {

    it("should reject invalid credentials", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "fake@test.com",
                password: "wrongpassword"
            });

        expect(res.statusCode).toBe(400);

    });

});