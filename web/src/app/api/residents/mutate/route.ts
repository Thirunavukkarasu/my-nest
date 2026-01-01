import { db } from '@/db';
import { residentSchema, residentsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input using Zod schema
        const validatedData = residentSchema.parse(body);

        // Insert the new resident
        const [newResident] = await db.insert(residentsTable)
            .values(validatedData)
            .returning();

        return NextResponse.json(
            {
                success: true,
                data: newResident
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error while creating resident: ', error);

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
                message: "Invalid flat ID",
                error: "The specified flat does not exist"
            }, { status: 400 });
        }

        // Handle unique constraint violations (duplicate email)
        if (error.code === '23505') {
            return NextResponse.json({
                message: "Email already exists",
                error: "A resident with this email already exists"
            }, { status: 409 });
        }

        return NextResponse.json({
            message: "Error while creating resident",
            error: error.message
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { residentId, ...updateFields } = body;

        if (!residentId) {
            return NextResponse.json({
                message: "Validation error",
                error: "residentId is required for update operation"
            }, { status: 400 });
        }

        // Check if resident exists
        const [existingResident] = await db.select()
            .from(residentsTable)
            .where(eq(residentsTable.residentId, residentId))
            .limit(1);

        if (!existingResident) {
            return NextResponse.json({
                message: "Not found",
                error: "Resident not found"
            }, { status: 404 });
        }

        // Validate input (including residentId for complete validation)
        const updateData = { ...updateFields, residentId };
        const validatedData = residentSchema.parse(updateData);

        // Update the resident
        const [updatedResident] = await db.update(residentsTable)
            .set(validatedData)
            .where(eq(residentsTable.residentId, residentId))
            .returning();

        return NextResponse.json({
            success: true,
            data: updatedResident
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error while updating resident: ', error);

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
                message: "Invalid flat ID",
                error: "The specified flat does not exist"
            }, { status: 400 });
        }

        // Handle unique constraint violations (duplicate email)
        if (error.code === '23505') {
            return NextResponse.json({
                message: "Email already exists",
                error: "A resident with this email already exists"
            }, { status: 409 });
        }

        return NextResponse.json({
            message: "Error while updating resident",
            error: error.message
        }, { status: 500 });
    }
}

