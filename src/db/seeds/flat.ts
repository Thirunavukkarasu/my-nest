import { DB } from '@/db'
import { flatsTable } from '@/db/schema'
import { faker } from '@faker-js/faker'
import { FlatSchema } from '../schema/flat'

const generatedFlatNumbers = new Set<string>() // Set to store unique flat numbers

const generateUniqueFlatNumber = (): string => {
  let flatNumber: string

  do {
    flatNumber =
      faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']) +
      faker.number.int({ min: 1, max: 20 })
  } while (generatedFlatNumbers.has(flatNumber)) // Keep generating until unique

  generatedFlatNumbers.add(flatNumber) // Add the unique flat number to the set
  return flatNumber
}

const mock = async () => {
  const data: FlatSchema[] = []

  for (let i = 0; i < 10; i++) {
    data.push({
      floorNumber: faker.number.int({ min: 1, max: 5 }),
      flatNumber: generateUniqueFlatNumber(),
      status: faker.helpers.arrayElement(['vacant', 'occupied']),
    })
  }

  return data
}

export async function seed(db: DB) {
  const insertData = await mock()
  await db.insert(flatsTable).values(insertData)
}
