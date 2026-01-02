import type { InferInsertModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from '../db';
import { flatSchema, flatsTable } from '../db/schema';
import { customPaginate } from '../lib/customPaginate';

const router = express.Router();
express.json();

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
        res.status(500).json({
            message: "Error while getting data",
            error: error.message
        });
    }
});

// POST /api/flats/mutate - Create flat
router.post('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const validatedData = flatSchema.parse(body);

        const [newFlat] = await db.insert(flatsTable)
            .values(validatedData as InferInsertModel<typeof flatsTable>)
            .returning();

        res.status(201).json({
            success: true,
            data: newFlat
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

