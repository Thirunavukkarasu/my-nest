'use server'

import { db } from '@/db'
import { ExpenseSchema, expensesTable } from '@/db/schema/expense'
import { eq } from 'drizzle-orm'

export async function createExpense(data: ExpenseSchema) {
    try {
        console.log('Creating expense:', data)
        await db.insert(expensesTable).values(data)
        return { success: true }
    } catch (error) {
        console.error('Failed to create expense:', error)
        return { success: false, error: 'Failed to create expense' }
    }
}

export async function updateExpense(data: ExpenseSchema) {
    if (!data.expenseId) {
        throw new Error('expenseId is required to update a expense')
    }

    await db.update(expensesTable)
        .set(data)
        .where(eq(expensesTable.expenseId, data.expenseId))
}