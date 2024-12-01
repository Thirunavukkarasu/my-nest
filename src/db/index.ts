import { VercelPool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from "@/db/schema";
import env from "@/lib/env";

const pool = new VercelPool({
    connectionString: env.POSTGRES_URL,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;