import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("Login validation", () => {

    it("should reject missing email or password", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({});

        expect(res.statusCode).toBe(400);

    });

});