import { DB } from '@/db'
import { expensesTable } from '@/db/schema'
import { faker } from '@faker-js/faker'
import { ExpenseSchema } from '../schema/expense'

const mock = async () => {
  const data: ExpenseSchema[] = []

  for (let i = 0; i < 20; i++) {
    const randomDate = faker.date.recent({ days: 30 })

    data.push({
      expenseDate: randomDate, // Random date in the last 30 days
      category: faker.helpers.arrayElement(['Security', 'Food', 'Office Supplies', 'Utilities', 'Other']),
      description: faker.lorem.words(),
      amount: faker.finance.amount({ min: 100, max: 1000, dec: 2 }), // Random amount between 100 and 1000
      paidBy: faker.person.fullName(),
      paymentMethod: faker.helpers.arrayElement(['Credit Card', 'Cash', 'Bank Transfer', 'UPI']),
      // receiptUrl : faker.internet.url(),
      status: faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected']),
      createdAt: randomDate, // Random date in the past year
      updatedAt: faker.date.between({ from: randomDate, to: new Date() }), // Random date between createdAt and now
    })
  }

  return data
}

export async function seed(db: DB) {
  const insertData = await mock()
  await db.insert(expensesTable).values(insertData)
}
