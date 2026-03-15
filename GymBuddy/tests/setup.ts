import { pool } from "../src/actions/db";

afterAll(async () => {
    await pool.end();
});