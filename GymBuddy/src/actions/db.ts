import { Pool, QueryResult, QueryResultRow } from "pg";
import { NetworkConfig } from "../config/network.config";
import { Client } from "pg";

export const ensureDatabaseExists = async () => {
    const dbName =
        process.env.PGDATABASE || NetworkConfig.DATABASE.DATABASE;

    const client = new Client({
        host: process.env.PGHOST || NetworkConfig.DATABASE.HOST,
        port: Number(process.env.PGPORT || NetworkConfig.DATABASE.PORT),
        user: process.env.PGUSER || NetworkConfig.DATABASE.USER,
        password: process.env.PGPASSWORD || NetworkConfig.DATABASE.PASSWORD,
        database: "postgres", // connect to default DB first
    });

    await client.connect();

    const res = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
    );

    if (res.rowCount === 0) {
        console.log(`Creating database: ${dbName}`);
        await client.query(`CREATE DATABASE ${dbName}`);
    }

    await client.end();
};

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
