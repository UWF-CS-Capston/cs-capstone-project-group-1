import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("QR invalid input", () => {

    it("should reject missing data for QR generation", async () => {

        const res = await request(app)
            .post("/api/qr/generate")
            .send({});

        expect(res.statusCode).toBeGreaterThanOrEqual(400);

    });

});