import type { InferInsertModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { flatSchema, flatsTable, residentsTable } from '../db/schema';
import { customPaginate } from '../lib/customPaginate';

const router = express.Router();
express.json();

// GET /api/flats/:id - Get single flat by ID with relations
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: "Validation error",
                error: "Invalid id parameter"
            });
        }

        // Use Drizzle's relational query API to fetch flat with relations
        const flat = await db.query.flatsTable.findFirst({
            where: (flats, { eq }) => eq(flats.flatId, id),
            with: {
                residents: true,
                ledgerEntries: true,
                vehicles: true
            }
        });

        if (!flat) {
            return res.status(404).json({
                message: "Not found",
                error: "Flat not found"
            });
        }

        res.status(200).json({
            success: true,
            data: flat
        });
    } catch (error: any) {
        console.error('Error while getting flat: ', error);
        res.status(500).json({
            message: "Error while getting flat",
            error: error.message || 'Unknown error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// GET /api/flats - List flats with pagination
router.post('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, searchCriterias = [], sortCriterias = [] } = req.body;
        const queryBuilder = customPaginate(db, 'flatsTable', flatsTable, {
            page,
            limit,
            searchCriterias,
            sortCriterias,
            with: {
                residents: true,
                ledgerEntries: true
            }
        });

        const result = await queryBuilder.execute();
        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error while getting data: ', error);
        console.error('Error stack: ', error.stack);
        console.error('Error details: ', {
            message: error.message,
            code: error.code,
            name: error.name,
            cause: error.cause
        });
        res.status(500).json({
            message: "Error while getting data",
            error: error.message || 'Unknown error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Validation schema for flat creation with owner
const createFlatWithOwnerSchema = flatSchema.extend({
    owner: z.object({
        firstName: z.string().min(1, "Owner first name is required"),
        lastName: z.string().min(1, "Owner last name is required"),
        email: z.string().email().optional().or(z.literal("")).nullable(),
        phone: z.string().optional().or(z.literal("")).nullable(),
        dateOfBirth: z.string().date().optional().nullable(),
    }),
});

// POST /api/flats/mutate - Create flat with owner
router.post('/mutate', async (req, res) => {
    try {
        const body = req.body;

        // Validate request body including owner
        const validatedData = createFlatWithOwnerSchema.parse(body);
        const { owner, ...flatData } = validatedData;

        // Use transaction to ensure both flat and owner are created together
        const result = await db.transaction(async (tx) => {
            // Create flat first
            const [newFlat] = await tx.insert(flatsTable)
                .values(flatData as InferInsertModel<typeof flatsTable>)
                .returning();

            // Create owner record
            // Convert empty strings to null for optional fields
            const ownerData = {
                flatId: newFlat.flatId,
                firstName: owner.firstName,
                lastName: owner.lastName,
                email: owner.email && owner.email.trim() !== "" ? owner.email : null,
                phone: owner.phone && owner.phone.trim() !== "" ? owner.phone : null,
                dateOfBirth: owner.dateOfBirth && owner.dateOfBirth.trim() !== "" ? owner.dateOfBirth : null,
                residentType: 'owner' as const,
                status: 'active' as const,
                leaseStartDate: new Date().toISOString().split('T')[0], // Use current date as lease start
                isPrimaryTenant: false,
            };

            const [newOwner] = await tx.insert(residentsTable)
                .values(ownerData as InferInsertModel<typeof residentsTable>)
                .returning();

            return { flat: newFlat, owner: newOwner };
        });

        res.status(201).json({
            success: true,
            data: {
                flat: result.flat,
                owner: result.owner
            }
        });
    } catch (error: any) {
        console.error('Error while creating flat: ', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23505') {
            return res.status(409).json({
                message: "Flat number already exists",
                error: "A flat with this number already exists"
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid reference",
                error: "Referenced record does not exist"
            });
        }

        res.status(500).json({
            message: "Error while creating flat",
            error: error.message
        });
    }
});

// PUT /api/flats/mutate - Update flat
router.put('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const { flatId, ...updateFields } = body;

        if (!flatId) {
            return res.status(400).json({
                message: "Validation error",
                error: "flatId is required for update operation"
            });
        }

        const [existingFlat] = await db.select()
            .from(flatsTable)
            .where(eq(flatsTable.flatId, flatId))
            .limit(1);

        if (!existingFlat) {
            return res.status(404).json({
                message: "Not found",
                error: "Flat not found"
            });
        }

        const updateData = { ...updateFields, flatId };
        const validatedData = flatSchema.parse(updateData);

        const [updatedFlat] = await db.update(flatsTable)
            .set(validatedData as Partial<InferInsertModel<typeof flatsTable>>)
            .where(eq(flatsTable.flatId, flatId))
            .returning();

        res.status(200).json({
            success: true,
            data: updatedFlat
        });
    } catch (error: any) {
        console.error('Error while updating flat: ', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23505') {
            return res.status(409).json({
                message: "Flat number already exists",
                error: "A flat with this number already exists"
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid reference",
                error: "Referenced record does not exist"
            });
        }

        res.status(500).json({
            message: "Error while updating flat",
            error: error.message
        });
    }
});

// DELETE /api/flats/mutate/:id - Delete flat
router.delete('/mutate/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: "Validation error",
                error: "Invalid id parameter"
            });
        }

        const [existingFlat] = await db.select()
            .from(flatsTable)
            .where(eq(flatsTable.flatId, id))
            .limit(1);

        if (!existingFlat) {
            return res.status(404).json({
                message: "Not found",
                error: "Flat not found"
            });
        }

        await db.delete(flatsTable)
            .where(eq(flatsTable.flatId, id));

        res.status(200).json({
            success: true,
            message: "Flat deleted successfully"
        });
    } catch (error: any) {
        console.error('Error while deleting flat: ', error);
        res.status(500).json({
            message: "Error while deleting flat",
            error: error.message
        });
    }
});

export default router;

