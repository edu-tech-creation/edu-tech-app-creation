import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is required for the education backend")
}

const globalForDb = globalThis as unknown as { pool?: Pool }
const pool = globalForDb.pool ?? new Pool({ connectionString, max: 5 })

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool

export const db = drizzle(pool)
export { pool }
