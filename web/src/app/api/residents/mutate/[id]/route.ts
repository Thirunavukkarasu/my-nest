import { db } from '@/db';
import { residentsTable } from '@/db/schema';
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

        // Check if resident exists
        const [existingResident] = await db.select()
            .from(residentsTable)
            .where(eq(residentsTable.residentId, id))
            .limit(1);

        if (!existingResident) {
            return NextResponse.json({
                message: "Not found",
                error: "Resident not found"
            }, { status: 404 });
        }

        // Delete the resident (cascade will handle related records)
        await db.delete(residentsTable)
            .where(eq(residentsTable.residentId, id));

        return NextResponse.json({
            success: true,
            message: "Resident deleted successfully"
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error while deleting resident: ', error);

        return NextResponse.json({
            message: "Error while deleting resident",
            error: error.message
        }, { status: 500 });
    }
}

