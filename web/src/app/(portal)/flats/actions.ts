'use server'

import { db } from '@/db'
import { FlatSchema, flatsTable } from '@/db/schema/flat'
import { eq } from 'drizzle-orm'

export async function createFlat(data: FlatSchema) {
    try {
        console.log('Creating flat:', data)
        await db.insert(flatsTable).values(data)
        return { success: true }
    } catch (error) {
        console.error('Failed to create flat:', error)
        return { success: false, error: 'Failed to create flat' }
    }
}

export async function updateFlat(data: FlatSchema) {
    if (!data.flatId) {
        throw new Error('flatId is required to update a flat')
    }

    await db.update(flatsTable)
        .set(data)
        .where(eq(flatsTable.flatId, data.flatId))
}