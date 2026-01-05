import { sql, Table } from "drizzle-orm";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import env from "../lib/env";
import * as schema from "./schema";
import * as seeds from "./seeds";

const pool = new Pool({
  connectionString: env.POSTGRES_URL,
});

const db = drizzle(pool, { schema });

type DB = NodePgDatabase<typeof schema>;

async function resetTable(db: DB, table: Table) {
  return db.execute(sql`truncate table ${table} restart identity cascade`)
}

async function main() {
  for (const table of [
    schema.usersTable,
    schema.flatsTable,
    schema.residentsTable,
    schema.ledgerTable,
  ]) {
    await resetTable(db, table)
  }
  await seeds.flat(db)
  await seeds.resident(db)
  // Note: payment and expense seeds are deprecated - use ledger instead
  // await seeds.payment(db)
  // await seeds.expense(db)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    console.log("Seeding done!");
    process.exit(0);
  });

