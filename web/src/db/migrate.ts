import env from "@/lib/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: env.POSTGRES_URL,
});

const db = drizzle(pool);

async function main() {
    // Use the migrations folder path - relative to project root
    // This works with tsx which resolves paths from the project root
    const migrationsFolder = path.join(process.cwd(), "src/db/migrations");
    await migrate(db, { migrationsFolder });
    console.log("✅ Migration done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await pool.end();
    });
