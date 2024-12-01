import { db } from '@/db';
import { residentsTable } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { flatId, firstName, lastName, email, leaseStartDate } = await req.json();

        const flat = await db.insert(residentsTable).values({
            flatId,
            firstName,
            lastName,
            email,
            leaseStartDate
        });

        // Return the newly created user (without password)
        return NextResponse.json({ flat }, { status: 200 });
    } catch (error: any) {
        console.error('Error while creating data: ', error);
        return NextResponse.json({
            message: "Error while creating data",
            error: error.message
        }, { status: 500 });
    }
}
