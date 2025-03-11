import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const config = {
    connectionString: process.env.DB_CREDENTIALS,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
};


const connectionPool = new pg.Pool(config);

connectionPool.connect()
    .then(() => console.log("Tilkoblet til PostgreSQL via External Database URL"))
    .catch((error) => console.error("Feil ved tilkobling:", error));

export default connectionPool;