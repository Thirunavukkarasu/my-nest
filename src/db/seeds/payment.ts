import { faker } from "@faker-js/faker";
import { db, DB } from "@/db";
import { PaymentSchema, paymentsTable } from "@/db/schema/payment";

const mock = async () => {
    const [flatsData, residentsData] = await Promise.all([
        db.query.flatsTable.findMany(),
        db.query.residentsTable.findMany()
    ]);
    const data: PaymentSchema[] = [];

    for (let i = 0; i < 100; i++) {
        const flat = faker.helpers.arrayElement(flatsData);
        const resident = faker.helpers.arrayElement(residentsData);
        data.push({
            "flatId": flat.flatId,
            "residentId": resident.residentId,
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
