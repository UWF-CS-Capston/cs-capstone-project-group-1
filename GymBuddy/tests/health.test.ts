import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("Health endpoint", () => {
    it("should return status ok", async () => {
        const res = await request(app).get("/health");

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("ok");
    });
});