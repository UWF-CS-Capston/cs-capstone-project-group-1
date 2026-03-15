import request from "supertest";
import app from "../src/actions/server";

describe("QR endpoint", () => {

    it("should block QR generation without auth", async () => {

        const res = await request(app)
            .get("/api/qr/generate");

        expect(res.statusCode).toBe(401);

    });

});