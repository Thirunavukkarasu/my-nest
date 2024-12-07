import { db } from '@/db';
import { paymentsTable } from '@/db/schema';
import { customPaginate } from '@/lib/customPaginate';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { page = 1, limit = 10, searchCriterias = [], sortCriterias = [] } = await req.json();

        const queryBuilder = customPaginate(db, paymentsTable, {
            page,
            limit,
            searchCriterias,
            sortCriterias,
            with: {
                flat: true,
                resident: true
            }
        });
        const result = await queryBuilder.execute('paymentsTable');

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Error while getting data: ', error);
        return NextResponse.json({
            message: "Error while getting data",
            error: error.message
        }, { status: 500 });
    }
}
