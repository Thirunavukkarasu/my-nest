import { faker } from "@faker-js/faker";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PaymentSchema, paymentsTable } from "@/db/schema/payment";
import * as schema from "@/db/schema";

type DB = NodePgDatabase<typeof schema>;

const mock = async (db: DB) => {
    const [flatsData, residentsData] = await Promise.all([
        db.query.flatsTable.findMany(),
        db.query.residentsTable.findMany()
    ]);
    const data: PaymentSchema[] = [];

    for (let i = 0; i < 100; i++) {
        const flat: any = faker.helpers.arrayElement(flatsData);
        data.push({
            "flatId": flat.flatId,
            "amount": faker.number.int({ min: 100, max: 1000 }).toPrecision(2),
            "paymentDate": faker.date.recent().toISOString().split('T')[0]
        });
    }

    return data;
};

export async function seed(db: DB) {
    const insertData = await mock(db);
    await db.insert(paymentsTable).values(insertData);
}
