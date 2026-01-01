import { db } from '@/db';
import { flatSchema, flatsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input using Zod schema
        const validatedData = flatSchema.parse(body);

        // Insert the new flat
        const [newFlat] = await db.insert(flatsTable)
            .values(validatedData)
            .returning();

        return NextResponse.json(
            {
                success: true,
                data: newFlat
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error while creating flat: ', error);

        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return NextResponse.json({
                message: "Validation error",
                error: error.errors
            }, { status: 400 });
        }

        // Handle unique constraint violations (duplicate flatNumber)
        if (error.code === '23505') {
            return NextResponse.json({
                message: "Flat number already exists",
                error: "A flat with this number already exists"
            }, { status: 409 });
        }

        // Handle foreign key constraint violations
        if (error.code === '23503') {
            return NextResponse.json({
                message: "Invalid reference",
                error: "Referenced record does not exist"
            }, { status: 400 });
        }

        return NextResponse.json({
            message: "Error while creating flat",
            error: error.message
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { flatId, ...updateFields } = body;

        if (!flatId) {
            return NextResponse.json({
                message: "Validation error",
                error: "flatId is required for update operation"
            }, { status: 400 });
        }

        // Check if flat exists
        const [existingFlat] = await db.select()
            .from(flatsTable)
            .where(eq(flatsTable.flatId, flatId))
            .limit(1);

        if (!existingFlat) {
            return NextResponse.json({
                message: "Not found",
                error: "Flat not found"
            }, { status: 404 });
        }

        // Validate input (including flatId for complete validation)
        const updateData = { ...updateFields, flatId };
        const validatedData = flatSchema.parse(updateData);

        // Update the flat
        const [updatedFlat] = await db.update(flatsTable)
            .set(validatedData)
            .where(eq(flatsTable.flatId, flatId))
            .returning();

        return NextResponse.json({
            success: true,
            data: updatedFlat
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error while updating flat: ', error);

        // Handle Zod validation errors
        if (error.name === 'ZodError') {
            return NextResponse.json({
                message: "Validation error",
                error: error.errors
            }, { status: 400 });
        }

        // Handle unique constraint violations (duplicate flatNumber)
        if (error.code === '23505') {
            return NextResponse.json({
                message: "Flat number already exists",
                error: "A flat with this number already exists"
            }, { status: 409 });
        }

        // Handle foreign key constraint violations
        if (error.code === '23503') {
            return NextResponse.json({
                message: "Invalid reference",
                error: "Referenced record does not exist"
            }, { status: 400 });
        }

        return NextResponse.json({
            message: "Error while updating flat",
            error: error.message
        }, { status: 500 });
    }
}

