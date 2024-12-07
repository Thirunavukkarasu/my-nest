import { db } from '@/db';
import { flatsTable, residentsTable } from '@/db/schema';
import { customPaginate } from '@/lib/customPaginate';
import { group } from 'console';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { page = 1, limit = 10, searchCriterias = [], sortCriterias = [] } = await req.json();
        const queryBuilder = customPaginate(db, flatsTable, {
            page,
            limit,
            searchCriterias,
            sortCriterias,
        });

        // Add joins or other operations
        queryBuilder.query = queryBuilder.query.leftJoin(residentsTable, eq(flatsTable.flatId, residentsTable.flatId));
        queryBuilder.query = queryBuilder.query.groupBy(flatsTable.flatId);

        // Execute the query when ready
        const result = await queryBuilder.execute();

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Error while getting data: ', error);
        return NextResponse.json({
            message: "Error while getting data",
            error: error.message
        }, { status: 500 });
    }
}
