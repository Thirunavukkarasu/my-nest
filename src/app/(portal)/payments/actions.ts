'use server'

import { db } from '@/db'
import { PaymentSchema, paymentsTable } from '@/db/schema/payment'
import { revalidatePath } from 'next/cache'

export async function createPayment(data: PaymentSchema) {
    try {
        console.log('Creating payment:', data)
        await db.insert(paymentsTable).values(data)
        // Redirect to a success page
        revalidatePath('/payments')
    } catch (error) {
        console.error('Failed to create payment:', error)
        return { success: false, error: 'Failed to create payment' }
    }
}

