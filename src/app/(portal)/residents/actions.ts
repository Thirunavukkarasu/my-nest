'use server'

import { db } from '@/db'
import { ResidentSchema, residentsTable } from '@/db/schema/resident'
import { eq } from 'drizzle-orm'

export async function createResident(data: ResidentSchema) {
    try {
        console.log('Creating resident:', data)
        await db.insert(residentsTable).values(data)
        return { success: true }
    } catch (error) {
        console.error('Failed to create resident:', error)
        return { success: false, error: 'Failed to create resident' }
    }
}

export async function updateResident(data: ResidentSchema) {
    if (data.residentId !== undefined) {
        await db.update(residentsTable)
            .set(data)
            .where(eq(residentsTable.residentId, data.residentId))
    } else {
        throw new Error('residentId is required to update a resident')
    }
}
