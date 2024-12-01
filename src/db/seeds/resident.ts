import { db, DB } from "@/db";
import { faker } from "@faker-js/faker";
import { residentsTable, ResidentSchema } from "@/db/schema/resident";

const mock = async () => {
    const [flatsData] = await Promise.all([
        db.query.flatsTable.findMany()
    ]);
    const data: ResidentSchema[] = [];

    for (let i = 0; i < 10; i++) {
        const flat = faker.helpers.arrayElement(flatsData);
        data.push({
            "flatId": flat.flatId,
            "firstName": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "phone": faker.phone.number(),
            "leaseStartDate": faker.date.recent().toUTCString()
        });
    }

    return data;
};

export async function seed(db: DB) {
    const insertData = await mock();
    await db.insert(residentsTable).values(insertData);
}
