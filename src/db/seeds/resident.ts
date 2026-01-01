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

  return data
}

const data:any[]= [
  {
      "flatId": "G001",
      "firstName": "ARUN ",
      "lastName": "KUMAR S",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "G002",
      "firstName": "MADHUSUDHAN ",
      "lastName": "REDDY",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "G003",
      "firstName": "RAJESH",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "G004",
      "firstName": "PUTTARAJA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "G005",
      "firstName": "BHUPENDER NAYAL",
      "lastName": "Shukla",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "G006",
      "firstName": "V HUSENAPPA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "G007",
      "firstName": "SHRUTI LATA  ",
      "lastName": "Gupta",
      "email": "21.shruti.gupta@gmail.com",
      "phone": "9742364909"
  },
  {
      "flatId": "G008",
      "firstName": "JAGADESHWARI",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "G009",
      "firstName": "MADHUSUDHAN ",
      "lastName": "REDDY",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F101",
      "firstName": "SHANKAR  ",
      "lastName": "KUMBAR",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F102",
      "firstName": "B SHRILILY ",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F103",
      "firstName": "RAJASHEKAR",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F104",
      "firstName": "Manjunath",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F105",
      "firstName": "MURALI",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F106",
      "firstName": "SRI LAKSHMI",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F107",
      "firstName": "RAVINDRA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F108",
      "firstName": "NAVEEN ",
      "lastName": "KUMAR",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F109",
      "firstName": "MOUNIKA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "S201",
      "firstName": "H M BASAVARAJU",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "S202",
      "firstName": "SURESH",
      "lastName": "ADINARAYANA",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "S203",
      "firstName": "CHIDAMBAR",
      "lastName": "REDDY",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "S204",
      "firstName": "KRISHNA ",
      "lastName": "PARU",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "S205",
      "firstName": "NEERAJA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "S206",
      "firstName": "SWATI ",
      "lastName": "GUPTA",
      "email": "swati.gu11@gmail.com",
      "phone": "8050634122"
  },
  {
      "flatId": "S207",
      "firstName": "NUNU",
      "lastName": "SAH",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "S208",
      "firstName": "Lakshman ",
      "lastName": "Bhaktha",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "S209",
      "firstName": "KIRAN KUMAR ",
      "lastName": "REDDY",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T301",
      "firstName": "LATHA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T302",
      "firstName": "D SHOBA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T303",
      "firstName": "Uma",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T304",
      "firstName": "Varun (MOHAN)",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T305",
      "firstName": "Srinivas",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T306",
      "firstName": "SRINIVAS",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T307",
      "firstName": "V HUSENAPPA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T308",
      "firstName": "DEVI PRASAD",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "T309",
      "firstName": "RAMA KRISHNA",
      "lastName": "YALLA",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F401",
      "firstName": "PRATIK ",
      "lastName": "SHETTY",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F402",
      "firstName": "RAVINDRA",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F403",
      "firstName": "Uma",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F404",
      "firstName": "VIKRAM",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F405",
      "firstName": "Uma",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F406",
      "firstName": "NAGESHWAR ",
      "lastName": "REDDY",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F407",
      "firstName": "C R MADHU ",
      "lastName": "KUMAR",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F408",
      "firstName": "RAMESH.T.T",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F409",
      "firstName": "JAGADISH J",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F501",
      "firstName": "SRIKANTH",
      "lastName": "",
      "email": "",
      "phone": ""
  },
  {
      "flatId": "F502",
      "firstName": "JAKIR HUSSAIN",
      "lastName": "",
      "email": "",
      "phone": ""
  }
]

export async function seed(db: DB) {
  //const insertData = await mock(db)
  const flatsData = await Promise.all([db.query.flatsTable.findMany()]);
  const flatsDataArr = flatsData[0];

  const updatedData = data.map((d,index)=>{
    const flatDetails= flatsDataArr.find((f)=> f?.flatNumber === d.flatId);

    if(!flatDetails){
      console.log("Flat not found",d.flatId);
      throw new Error(`Flat not found for ${d.flatId}`);
    }
    d.email = d.email ? d.email : `${d.flatId}.${d.firstName.trim()}.${d.lastName.trim()}@gmail.com`.toLowerCase();
    d.flatId = flatDetails && flatDetails.flatId;
    d.leaseStartDate = new Date('2024-12-01');
    
   
    return d;

  })
  console.log("flatsData",updatedData);
  const insertData=updatedData;
  await db.insert(residentsTable).values(insertData)
}
