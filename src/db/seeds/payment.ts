import { faker } from "@faker-js/faker";
import { db, DB } from "@/db";
import { PaymentSchema, paymentsTable } from "@/db/schema/payment";

const mock = async () => {
    const [flatsData] = await Promise.all([
        db.query.flatsTable.findMany()
    ]);
    const data: PaymentSchema[] = [];

    for (let i = 0; i < 100; i++) {
        const flat = faker.helpers.arrayElement(flatsData);
        data.push({
            "flatId": flat.flatId,
            "amount": faker.number.int({ min: 100, max: 1000 }).toPrecision(2),
            "paymentDate": faker.date.recent().toUTCString()
        });
    }

    return data;
};

export async function seed(db: DB) {
    const insertData = await mock();
    await db.insert(paymentsTable).values(insertData);
}
