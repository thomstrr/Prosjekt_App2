import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const config = {
  connectionString: process.env.DB_CREDENTIALS,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
};

const connectionPool = new pkg.Pool(config);

connectionPool
  .connect()
  .then(() => console.log("Tilkoblet til PostgreSQL!"))
  .catch((error) => console.error("Feil ved tilkobling:", error));

export default connectionPool;
