import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { faker } from "@faker-js/faker";
import { residentsTable, ResidentSchema } from "@/db/schema/resident";
import * as schema from "@/db/schema";

type DB = NodePgDatabase<typeof schema>;

const mock = async (db: DB) => {
    const [flatsData] = await Promise.all([
        db.query.flatsTable.findMany()
    ]);
    const data: ResidentSchema[] = [];

    for (let i = 0; i < 10; i++) {
        const flat = faker.helpers.arrayElement(flatsData);
        const phoneNumber = faker.phone.number().replace(/\D/g, '').slice(0, 20);
        data.push({
            "flatId": flat.flatId,
            "firstName": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "phone": phoneNumber || undefined,
            "leaseStartDate": faker.date.recent().toISOString().split('T')[0]
        });
    }

    return data;
};

export async function seed(db: DB) {
    const insertData = await mock(db);
    await db.insert(residentsTable).values(insertData);
}
