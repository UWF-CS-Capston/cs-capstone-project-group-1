import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("Register endpoint", () => {

    it("should reject missing email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ password: "Password123!" });

        expect(res.statusCode).toBe(400);
    });

    it("should reject weak password", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: "test@test.com",
                password: "123"
            });

        expect(res.statusCode).toBe(400);
    });

});