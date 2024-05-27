import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.AUTH_DRIZZLE_URL!
});
export const db = drizzle(pool);
