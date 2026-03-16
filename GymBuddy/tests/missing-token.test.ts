import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("Missing token", () => {

    it("should reject request without authorization header", async () => {

        const res = await request(app)
            .get("/api/qr/generate");

        expect(res.statusCode).toBe(401);

    });

});