import pg from "pg";

export const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "docker",
    port: 5432,
});