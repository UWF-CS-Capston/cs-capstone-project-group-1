import { Pool, QueryResult, QueryResultRow } from "pg";

export const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl:
                process.env.DB_SSL === "true"
                    ? { rejectUnauthorized: false }
                    : false,
        }
        : {
            host: process.env.PGHOST || "localhost",
            port: Number(process.env.PGPORT || 5432),
            user: process.env.PGUSER || "postgres",
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE || "gymbuddy",
            ssl:
                process.env.DB_SSL === "true"
                    ? { rejectUnauthorized: false }
                    : false,
        }
);

export const query = <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> => {
    return pool.query<T>(text, params);
};

export const testDatabaseConnection = async () => {
    await pool.query("SELECT 1");
};
