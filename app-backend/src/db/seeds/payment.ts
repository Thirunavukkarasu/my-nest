import { faker } from "@faker-js/faker";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PaymentSchema, paymentsTable } from "../schema/payment";
import * as schema from "../schema";

type DB = NodePgDatabase<typeof schema>;

const mock = async (db: DB) => {
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
            "paymentDate": faker.date.recent().toISOString().split('T')[0]
        });
    }

    return data;
};


export async function seed(db: DB) {
    //const insertData = await mock();
    const paidFlatNumbers = [
        {
            flatNumber: "G002",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: faker.date.recent().toUTCString(),
        },
        {
            flatNumber: "G003",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "G004",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "G006",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "G009",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F101",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F102",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F103",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F105",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F106",
            notes: 'Paid for remaining 6 months as well',
            amount: 14000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F108",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F109",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "S202",
            notes: 'Paid for Nov and Dec',
            amount: 4000,
            paymentType: "",
            paymentMethod: "upi",
            paymentDate: "",
        },
        {
            flatNumber: "S203",
            notes: '',
            amount: 2000,
            paymentType: "",
            paymentMethod: "upi",
            paymentDate: "",
        },
        {
            flatNumber: "S205",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "S206",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "S207",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "S208",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "T301",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "T302",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "T304",
            notes: 'Paid maintenance and vehicle e-charge amount',
            amount: 2550,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "T306",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "T307",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "T308",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "T309",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F401",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F404",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F407",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F408",
            notes: '',
            amount: 2000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        },
        {
            flatNumber: "F501",
            notes: 'Paid 10k for remaining pending months on Dec 5th',
            amount: 10000,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: new Date('2021-12-05').toUTCString(),
        },
        {
            flatNumber: "F502",
            notes: '',
            amount: 3500,
            paymentType: "maintenance",
            paymentMethod: 'upi',
            paymentDate: "",
        }
    ];

    const residentsData = await db.query.residentsTable.findMany();
    const flatsData = await db.query.flatsTable.findMany();
    const paymentData: any = [];

    for (let flatIdx = 0; flatIdx < paidFlatNumbers.length; flatIdx++) {
        const flatData = flatsData.find(flat => flat.flatNumber === paidFlatNumbers[flatIdx]?.flatNumber);
        console.log(paidFlatNumbers[flatIdx].flatNumber, flatData);

        const residentData = residentsData.find(resident => resident.flatId === flatData?.flatId);
        paymentData.push({
            "flatId": flatData?.flatId,
            "residentId": residentData?.residentId,
            "amount": paidFlatNumbers[flatIdx]?.amount,
            "paymentType": paidFlatNumbers[flatIdx]?.paymentType,
            "paymentMethod": paidFlatNumbers[flatIdx]?.paymentMethod,
            "notes": paidFlatNumbers[flatIdx]?.notes,
            "paymentDate": paidFlatNumbers[flatIdx]?.paymentDate ? paidFlatNumbers[flatIdx]?.paymentDate : faker.date.recent().toUTCString()
        });
        //await db.insert(paymentsTable).values(paymentData);
    }
    console.log(paymentData);

    await db.insert(paymentsTable).values(paymentData);
}

