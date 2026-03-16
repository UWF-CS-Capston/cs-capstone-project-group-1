import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";
import { generateToken } from "../src/actions/utils/jwt";

describe("QR generation with auth", () => {

    it("should generate QR when authenticated", async () => {
        const token = generateToken(1, "member");

        const res = await request(app)
            .get("/api/qr/generate")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.qr).toBeDefined();
    });

});