import { db } from '@/db';
import { paymentsTable } from '@/db/schema';
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

        // Check if payment exists
        const [existingPayment] = await db.select()
            .from(paymentsTable)
            .where(eq(paymentsTable.paymentId, id))
            .limit(1);

        if (!existingPayment) {
            return NextResponse.json({
                message: "Not found",
                error: "Payment not found"
            }, { status: 404 });
        }

        // Delete the payment
        await db.delete(paymentsTable)
            .where(eq(paymentsTable.paymentId, id));

        return NextResponse.json({
            success: true,
            message: "Payment deleted successfully"
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error while deleting payment: ', error);

        return NextResponse.json({
            message: "Error while deleting payment",
            error: error.message
        }, { status: 500 });
    }
}

