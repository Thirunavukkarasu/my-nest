import { db } from '@/db';
import { flatsTable } from '@/db/schema';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const { flatNumber, floorNumber } = await req.json();

        const flat = await db.insert(flatsTable).values({
            flatNumber,
            floorNumber
        });

        // Return the newly created user (without password)
        return NextResponse.json({ flat }, { status: 200 });
    } catch (error) {
        console.error('Error while registering user', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
