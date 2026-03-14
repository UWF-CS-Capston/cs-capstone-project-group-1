import request from "supertest";
import app from "../src/actions/server";

describe("Duplicate registration", () => {

    it("should reject duplicate users", async () => {

        const user = {
            email: "duplicate@test.com",
            password: "password123"
        };

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const res = await request(app)
            .post("/api/auth/register")
            .send(user);

        expect(res.statusCode).toBe(400);

    });

});