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