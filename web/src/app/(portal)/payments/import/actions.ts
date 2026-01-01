'use server'

import { parse } from 'csv-parse/sync'
import { db } from "@/db"
import { paymentsTable } from "@/db/schema"
import { inArray } from 'drizzle-orm'

export async function importPayments(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) {
        throw new Error('No file uploaded')
    }

    const content = await file.text()
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true
    })

    const emails = records.map((record: any) => record.resident_email);
    //based on flat_number and resident_email, get flatId and residentId and add to the record
    const flatResidentMap = await db.query.residentsTable.findMany({
        where: (residents) => inArray(residents.email, emails)
    });
    records.forEach((record: any) => {
        const flatResident = flatResidentMap.find((item: any) => item.email === record.resident_email);
        if (flatResident) {
            record.flatId = flatResident.flatId;
            record.residentId = flatResident.residentId;
            record.paymentDate = new Date(record.payment_date);
            record.dueDate = record.due_date ? new Date(record.due_date) : null;
            record.amount = parseFloat(record.amount);
            record.status = record.status;
            record.paymentMethod = record.payment_method || 'UPI';
            record.referenceNumber = record.reference_number;
            record.paymentType = record.payment_type || 'monthly_maintenance';
        }
    });

    await db.insert(paymentsTable).values(records)

    return { importedCount: records.length }
}

