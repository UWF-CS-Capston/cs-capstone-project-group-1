import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../Backend/.env') });

import request from "supertest";
import app from "../src/actions/server";

describe("Protected route", () => {

    it("should reject request without token", async () => {

        const res = await request(app)
            .get("/api/protected");

        expect(res.statusCode).toBe(401);

    });

});