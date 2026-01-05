import { drizzle } from 'drizzle-orm/neon-serverless';
import env from "../lib/env";
import * as schema from "./schema";

export const db = drizzle(env.POSTGRES_URL, { schema });

export type DB = typeof db;

