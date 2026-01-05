import type { InferInsertModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from '../db';
import { residentSchema, residentsTable } from '../db/schema';
import { customPaginate } from '../lib/customPaginate';

const router = express.Router();
express.json();

// GET /api/residents - List residents with pagination
router.post('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, searchCriterias = [], sortCriterias = [] } = req.body;

        const queryBuilder = customPaginate(db, 'residentsTable', residentsTable, {
            page,
            limit,
            searchCriterias,
            sortCriterias,
            with: {
                flat: true
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

// POST /api/residents/mutate - Create resident
router.post('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const validatedData = residentSchema.parse(body);

        const [newResident] = await db.insert(residentsTable)
            .values(validatedData as InferInsertModel<typeof residentsTable>)
            .returning();

        res.status(201).json({
            success: true,
            data: newResident
        });
    } catch (error: any) {
        console.error('Error while creating resident: ', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid flat ID",
                error: "The specified flat does not exist"
            });
        }

        if (error.code === '23505') {
            return res.status(409).json({
                message: "Email already exists",
                error: "A resident with this email already exists"
            });
        }

        res.status(500).json({
            message: "Error while creating resident",
            error: error.message
        });
    }
});

// PUT /api/residents/mutate - Update resident
router.put('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const { residentId, ...updateFields } = body;

        if (!residentId) {
            return res.status(400).json({
                message: "Validation error",
                error: "residentId is required for update operation"
            });
        }

        const [existingResident] = await db.select()
            .from(residentsTable)
            .where(eq(residentsTable.residentId, residentId))
            .limit(1);

        if (!existingResident) {
            return res.status(404).json({
                message: "Not found",
                error: "Resident not found"
            });
        }

        const updateData = { ...updateFields, residentId };
        const validatedData = residentSchema.parse(updateData);

        const [updatedResident] = await db.update(residentsTable)
            .set(validatedData as Partial<InferInsertModel<typeof residentsTable>>)
            .where(eq(residentsTable.residentId, residentId))
            .returning();

        res.status(200).json({
            success: true,
            data: updatedResident
        });
    } catch (error: any) {
        console.error('Error while updating resident: ', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid flat ID",
                error: "The specified flat does not exist"
            });
        }

        if (error.code === '23505') {
            return res.status(409).json({
                message: "Email already exists",
                error: "A resident with this email already exists"
            });
        }

        res.status(500).json({
            message: "Error while updating resident",
            error: error.message
        });
    }
});

// DELETE /api/residents/mutate/:id - Delete resident
router.delete('/mutate/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: "Validation error",
                error: "Invalid id parameter"
            });
        }

        const [existingResident] = await db.select()
            .from(residentsTable)
            .where(eq(residentsTable.residentId, id))
            .limit(1);

        if (!existingResident) {
            return res.status(404).json({
                message: "Not found",
                error: "Resident not found"
            });
        }

        await db.delete(residentsTable)
            .where(eq(residentsTable.residentId, id));

        res.status(200).json({
            success: true,
            message: "Resident deleted successfully"
        });
    } catch (error: any) {
        console.error('Error while deleting resident: ', error);
        res.status(500).json({
            message: "Error while deleting resident",
            error: error.message
        });
    }
});

export default router;

