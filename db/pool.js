import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

export default pool;
