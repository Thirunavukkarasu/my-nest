'use server'

import { db } from '@/db'
import { FlatSchema, flatsTable } from '@/db/schema/flat'

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

