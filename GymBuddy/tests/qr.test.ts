import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("QR endpoint", () => {

    it("should block QR generation without auth", async () => {

        const res = await request(app)
            .get("/api/qr/generate");

        expect(res.statusCode).toBe(401);

    });

});