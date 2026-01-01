import { db } from '@/db';
import { flatsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (!id || isNaN(id)) {
            return NextResponse.json({
                message: "Validation error",
                error: "Invalid id parameter"
            }, { status: 400 });
        }

        // Check if flat exists
        const [existingFlat] = await db.select()
            .from(flatsTable)
            .where(eq(flatsTable.flatId, id))
            .limit(1);

        if (!existingFlat) {
            return NextResponse.json({
                message: "Not found",
                error: "Flat not found"
            }, { status: 404 });
        }

        // Delete the flat (cascade will handle related records)
        await db.delete(flatsTable)
            .where(eq(flatsTable.flatId, id));

        return NextResponse.json({
            success: true,
            message: "Flat deleted successfully"
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error while deleting flat: ', error);

        return NextResponse.json({
            message: "Error while deleting flat",
            error: error.message
        }, { status: 500 });
    }
}

