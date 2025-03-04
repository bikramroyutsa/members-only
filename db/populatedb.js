import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
const { Client } = pg;

const SQL = `
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) unique,
    email VARCHAR(255) unique,
    password TEXT,
    isadmin BOOLEAN
    )
`;
async function main() {
  console.log("seeding");
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING_LOCAL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}
main()