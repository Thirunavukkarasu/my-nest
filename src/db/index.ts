import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@/db/schema";
import env from "@/lib/env";

export const db = drizzle(env.POSTGRES_URL, { schema });

export type DB = typeof db;