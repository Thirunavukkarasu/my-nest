import { db } from '@/db';
import { paymentSchema, paymentsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input using Zod schema
        const validatedData = paymentSchema.parse(body);

        // Insert the new payment
        const [newPayment] = await db.insert(paymentsTable)
            .values(validatedData)
            .returning();

        return NextResponse.json(
            {
                success: true,
                data: newPayment
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error while creating payment: ', error);

        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return NextResponse.json({
                message: "Validation error",
                error: error.errors
            }, { status: 400 });
        }

        // Handle foreign key constraint violations
        if (error.code === '23503') {
            return NextResponse.json({
                message: "Invalid flat or resident ID",
                error: "The specified flat or resident does not exist"
            }, { status: 400 });
        }

        return NextResponse.json({
            message: "Error while creating payment",
            error: error.message
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { paymentId, ...updateFields } = body;

        if (!paymentId) {
            return NextResponse.json({
                message: "Validation error",
                error: "paymentId is required for update operation"
            }, { status: 400 });
        }

        // Check if payment exists
        const [existingPayment] = await db.select()
            .from(paymentsTable)
            .where(eq(paymentsTable.paymentId, paymentId))
            .limit(1);

        if (!existingPayment) {
            return NextResponse.json({
                message: "Not found",
                error: "Payment not found"
            }, { status: 404 });
        }

        // Validate input (including paymentId for complete validation)
        const updateData = { ...updateFields, paymentId };
        const validatedData = paymentSchema.parse(updateData);

        // Update the payment
        const [updatedPayment] = await db.update(paymentsTable)
            .set(validatedData)
            .where(eq(paymentsTable.paymentId, paymentId))
            .returning();

        return NextResponse.json({
            success: true,
            data: updatedPayment
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error while updating payment: ', error);

        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return NextResponse.json({
                message: "Validation error",
                error: error.errors
            }, { status: 400 });
        }

        // Handle foreign key constraint violations
        if (error.code === '23503') {
            return NextResponse.json({
                message: "Invalid flat or resident ID",
                error: "The specified flat or resident does not exist"
            }, { status: 400 });
        }

        return NextResponse.json({
            message: "Error while updating payment",
            error: error.message
        }, { status: 500 });
    }
}

