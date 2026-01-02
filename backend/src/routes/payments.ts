import type { InferInsertModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from '../db';
import { paymentSchema, paymentsTable } from '../db/schema';
import { customPaginate } from '../lib/customPaginate';

const router = express.Router();
express.json();

// GET /api/payments - List payments with pagination
router.post('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, searchCriterias = [], sortCriterias = [] } = req.body;

        const queryBuilder = customPaginate(db, 'paymentsTable', paymentsTable, {
            page,
            limit,
            searchCriterias,
            sortCriterias,
            with: {
                flat: true,
                resident: true
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

// POST /api/payments/mutate - Create payment
router.post('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const validatedData = paymentSchema.parse(body);

        const [newPayment] = await db.insert(paymentsTable)
            .values(validatedData as InferInsertModel<typeof paymentsTable>)
            .returning();

        res.status(201).json({
            success: true,
            data: newPayment
        });
    } catch (error: any) {
        console.error('Error while creating payment: ', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid flat or resident ID",
                error: "The specified flat or resident does not exist"
            });
        }

        res.status(500).json({
            message: "Error while creating payment",
            error: error.message
        });
    }
});

// PUT /api/payments/mutate - Update payment
router.put('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const { paymentId, ...updateFields } = body;

        if (!paymentId) {
            return res.status(400).json({
                message: "Validation error",
                error: "paymentId is required for update operation"
            });
        }

        const [existingPayment] = await db.select()
            .from(paymentsTable)
            .where(eq(paymentsTable.paymentId, paymentId))
            .limit(1);

        if (!existingPayment) {
            return res.status(404).json({
                message: "Not found",
                error: "Payment not found"
            });
        }

        const updateData = { ...updateFields, paymentId };
        const validatedData = paymentSchema.parse(updateData);

        const [updatedPayment] = await db.update(paymentsTable)
            .set(validatedData as Partial<InferInsertModel<typeof paymentsTable>>)
            .where(eq(paymentsTable.paymentId, paymentId))
            .returning();

        res.status(200).json({
            success: true,
            data: updatedPayment
        });
    } catch (error: any) {
        console.error('Error while updating payment: ', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid flat or resident ID",
                error: "The specified flat or resident does not exist"
            });
        }

        res.status(500).json({
            message: "Error while updating payment",
            error: error.message
        });
    }
});

// DELETE /api/payments/mutate/:id - Delete payment
router.delete('/mutate/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: "Validation error",
                error: "Invalid id parameter"
            });
        }

        const [existingPayment] = await db.select()
            .from(paymentsTable)
            .where(eq(paymentsTable.paymentId, id))
            .limit(1);

        if (!existingPayment) {
            return res.status(404).json({
                message: "Not found",
                error: "Payment not found"
            });
        }

        await db.delete(paymentsTable)
            .where(eq(paymentsTable.paymentId, id));

        res.status(200).json({
            success: true,
            message: "Payment deleted successfully"
        });
    } catch (error: any) {
        console.error('Error while deleting payment: ', error);
        res.status(500).json({
            message: "Error while deleting payment",
            error: error.message
        });
    }
});

export default router;

