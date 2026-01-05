/**
 * Standalone script to seed permissions into the database
 * Run this before starting the server to ensure all permissions are available
 */
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "../lib/env";
import * as schema from "./schema";
import { seed as seedPermissions } from "./seeds/permission";

const pool = new Pool({
    connectionString: env.POSTGRES_URL,
});

const db = drizzle(pool, { schema });

type DB = NodePgDatabase<typeof schema>;

async function main() {
    console.log('🚀 Starting permissions seed...');
    await seedPermissions(db);
    console.log('✅ Permissions seed completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding permissions:', e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
        process.exit(0);
    });

