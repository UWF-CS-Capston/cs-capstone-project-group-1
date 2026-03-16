import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";
import { generateToken } from "../src/actions/utils/jwt";

describe("Auth middleware", () => {

    it("should allow access with valid token", async () => {
        const token = generateToken(1, "member");

        const res = await request(app)
            .get("/api/protected")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

});