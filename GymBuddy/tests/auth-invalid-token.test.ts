import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("Invalid token handling", () => {

    it("should reject an invalid JWT", async () => {

        const res = await request(app)
            .get("/api/qr/generate")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(403);

    });

});