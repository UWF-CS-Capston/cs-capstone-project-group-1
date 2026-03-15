import request from "supertest";
import app from "../src/actions/server";

describe("Missing token", () => {

    it("should reject request without authorization header", async () => {

        const res = await request(app)
            .get("/api/qr/generate");

        expect(res.statusCode).toBe(401);

    });

});