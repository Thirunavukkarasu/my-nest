'use server'

import { db } from '@/db'
import { ResidentSchema, residentsTable } from '@/db/schema/resident'

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

