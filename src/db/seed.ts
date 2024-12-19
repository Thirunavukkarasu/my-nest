import { sql, Table } from 'drizzle-orm'

import { db, DB } from '@/db'
import * as schema from '@/db/schema'
import * as seeds from '@/db/seeds'

async function resetTable(db: DB, table: Table) {
  return db.execute(sql`truncate table ${table} restart identity cascade`)
}

async function main() {
  for (const table of [
    schema.usersTable,
    schema.flatsTable,
    schema.residentsTable,
    schema.paymentsTable,
    schema.expensesTable,
  ]) {
    await resetTable(db, table)
  }
  await seeds.flat(db)
  await seeds.resident(db)
  await seeds.payment(db)
  await seeds.expense(db)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Seeding done!')
    process.exit(0)
  })
