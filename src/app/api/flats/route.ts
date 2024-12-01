import { db } from '@/db';
import { flatsTable } from '@/db/schema';
import { customPaginate } from '@/lib/customPaginate';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { page = 1, limit = 10, searchCriterias = [], sortCriterias = [] } = await req.json();

        const result = await customPaginate(db, flatsTable, {
            page,
            limit,
            searchCriterias,
            sortCriterias,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error while getting data', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
