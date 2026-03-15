import request from "supertest";
import app from "../src/actions/server";

describe("Protected route", () => {

    it("should reject request without token", async () => {

        const res = await request(app)
            .get("/api/protected");

        expect(res.statusCode).toBe(401);

    });

});