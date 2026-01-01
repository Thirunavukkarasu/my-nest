import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { flatsTable } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { FlatSchema } from "../schema/flat";
import * as schema from "@/db/schema";

type DB = NodePgDatabase<typeof schema>;

const mock = async () => {
    const data: FlatSchema[] = [];

    for (let i = 0; i < 10; i++) {
        data.push({
            floorNumber: faker.number.int({ min: 1, max: 5 }),
            flatNumber: faker.helpers.arrayElement(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]) + faker.number.int({ min: 1, max: 20 }),
            status: faker.helpers.arrayElement(["vacant", "occupied"]),
        });
    }

    return data;
};

export async function seed(db: DB) {
    const insertData = await mock();
    await db.insert(flatsTable).values(insertData);
}
