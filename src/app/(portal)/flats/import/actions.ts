'use server'

import { parse } from 'csv-parse/sync'
import { db } from "@/db"
import { flatsTable } from "@/db/schema"

export async function importFlats(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) {
        throw new Error('No file uploaded')
    }

    const content = await file.text()
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true
    })
    const finalRecords = records.map((record: any) => {
        record.floorNumber = record.floorNumber ? record.floorNumber.trim() : 0;
        record.flatNumber = record.flatNumber.trim();
        return record
    });

    await db.insert(flatsTable).values(finalRecords)

    return { importedCount: records.length }
}

