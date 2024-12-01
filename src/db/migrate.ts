import config from "$/drizzle.config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { VercelPool } from "@vercel/postgres";
import env from "@/lib/env";

const pool = new VercelPool({
    connectionString: env.POSTGRES_URL,
});

const db = drizzle(pool);

async function main() {
    if (config.out) {
        await migrate(db, { migrationsFolder: config.out });
        console.log("Migration done!");
    }
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await pool.end();
    });