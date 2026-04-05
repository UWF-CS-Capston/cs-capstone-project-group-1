import { Pool, QueryResult, QueryResultRow } from "pg";
import { NetworkConfig } from "../config/network.config";

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
            host: process.env.PGHOST || NetworkConfig.DATABASE.HOST,
            port: Number(process.env.PGPORT || NetworkConfig.DATABASE.PORT),
            user: process.env.PGUSER || NetworkConfig.DATABASE.USER,
            password: process.env.PGPASSWORD || NetworkConfig.DATABASE.PASSWORD,
            database: process.env.PGDATABASE || NetworkConfig.DATABASE.DATABASE,
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
