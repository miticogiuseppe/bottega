import pkg from "pg";
const { Pool, types } = pkg;

types.setTypeParser(1700, (val) => parseFloat(val));

let pool;

export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing");
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }

  return pool;
}
