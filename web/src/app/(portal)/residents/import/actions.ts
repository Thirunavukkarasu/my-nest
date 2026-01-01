'use server'

import { parse } from 'csv-parse/sync'
import { db } from "@/db"
import { residentsTable } from "@/db/schema"
import { ResidentSchema } from '@/db/schema/resident'
import { inArray } from 'drizzle-orm'

export async function importResidents(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) {
        throw new Error('No file uploaded')
    }

    const content = await file.text()
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true
    });

    const flatNumbers = records.map((record: any) => record.flatNumber);
    console.log(flatNumbers);
    //based on flat_number get flatId and add to the record
    const flatMap = await db.query.flatsTable.findMany({
        where: (flats) => inArray(flats.flatNumber, flatNumbers)
    });
    //need to import these records into the residents table
    const finalRecords: any = [];
    records.forEach((record: any) => {

        const flat = flatMap.find((item: any) => item.flatNumber === record.flatNumber);
        console.log(flat);
        if (flat) {
            record.flatId = flat?.flatId ?? 0;
            record.firstName = record.firstName.trim();
            record.lastName = record.lastName.trim();
            record.email = record.email?.trim() ?? '';
            record.phone = record.phone?.trim() ?? '';
            record.leaseStartDate = record.leaseStartDate.trim();
            record.leaseEndDate = record.leaseEndDate?.trim() ?? '';
            record.isPrimaryTenant = record.isPrimaryTenant ?? false;
            finalRecords.push(record);
        }
    })
    console.log(finalRecords);

    await db.insert(residentsTable).values(finalRecords)

    return { importedCount: records.length }
}

