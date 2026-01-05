import type { InferInsertModel } from 'drizzle-orm';
import { and, eq, sql } from 'drizzle-orm';
import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { ledgerSchema, ledgerTable } from '../db/schema';
import { customPaginate } from '../lib/customPaginate';

const router = express.Router();
express.json();

/**
 * GET /api/ledger - List ledger entries with pagination
 * Supports filtering by entryType, category, flatId, date range, etc.
 */
router.post('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, searchCriterias = [], sortCriterias = [] } = req.body;

        const queryBuilder = customPaginate(db, 'ledgerTable', ledgerTable, {
            page,
            limit,
            searchCriterias,
            sortCriterias,
            with: {
                flat: true,
                resident: true,
                creator: true,
            }
        });
        const result = await queryBuilder.execute();

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error while getting ledger data: ', error);
        res.status(500).json({
            message: "Error while getting ledger data",
            error: error.message
        });
    }
});

/**
 * POST /api/ledger/mutate - Create ledger entry
 * For credits: requires flatId, residentId (optional), category='maintenance'
 * For debits: requires category (security, cleaning, utilities, repairs), paidBy
 */
router.post('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const validatedData = ledgerSchema.parse(body);

        // Insert entry first (balance will be calculated by trigger or on-demand)
        const [newEntry] = await db.insert(ledgerTable)
            .values(validatedData as InferInsertModel<typeof ledgerTable>)
            .returning();

        // Calculate and update running balance
        await updateRunningBalances();

        // Fetch the updated entry with balance
        const [updatedEntry] = await db.select()
            .from(ledgerTable)
            .where(eq(ledgerTable.ledgerId, newEntry.ledgerId))
            .limit(1);

        res.status(201).json({
            success: true,
            data: updatedEntry || newEntry
        });
    } catch (error: any) {
        console.error('Error while creating ledger entry: ', error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid reference",
                error: "The specified flat, resident, or user does not exist"
            });
        }

        res.status(500).json({
            message: "Error while creating ledger entry",
            error: error.message
        });
    }
});

/**
 * PUT /api/ledger/mutate - Update ledger entry
 */
router.put('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const { ledgerId, ...updateFields } = body;

        if (!ledgerId) {
            return res.status(400).json({
                message: "Validation error",
                error: "ledgerId is required for update operation"
            });
        }

        const [existingEntry] = await db.select()
            .from(ledgerTable)
            .where(eq(ledgerTable.ledgerId, ledgerId))
            .limit(1);

        if (!existingEntry) {
            return res.status(404).json({
                message: "Not found",
                error: "Ledger entry not found"
            });
        }

        const updateData = { ...updateFields, ledgerId };
        const validatedData = ledgerSchema.parse(updateData);

        const updatePayload: any = {
            ...validatedData as Partial<InferInsertModel<typeof ledgerTable>>,
        };
        delete updatePayload.ledgerId; // Remove ledgerId from update payload

        const [updatedEntry] = await db.update(ledgerTable)
            .set({
                ...updatePayload,
                updatedAt: sql`now()`,
            } as any)
            .where(eq(ledgerTable.ledgerId, ledgerId))
            .returning();

        // Recalculate all balances if amount or entryType changed
        if (updateFields.amount || updateFields.entryType) {
            await updateRunningBalances();

            // Fetch updated entry with recalculated balance
            const [finalEntry] = await db.select()
                .from(ledgerTable)
                .where(eq(ledgerTable.ledgerId, ledgerId))
                .limit(1);

            return res.status(200).json({
                success: true,
                data: finalEntry || updatedEntry
            });
        }

        res.status(200).json({
            success: true,
            data: updatedEntry
        });
    } catch (error: any) {
        console.error('Error while updating ledger entry: ', error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        res.status(500).json({
            message: "Error while updating ledger entry",
            error: error.message
        });
    }
});

/**
 * DELETE /api/ledger/mutate/:id - Delete ledger entry
 */
router.delete('/mutate/:id', async (req, res) => {
    try {
        const ledgerId = parseInt(req.params.id);

        if (isNaN(ledgerId)) {
            return res.status(400).json({
                message: "Validation error",
                error: "Invalid ledger ID"
            });
        }

        const [existingEntry] = await db.select()
            .from(ledgerTable)
            .where(eq(ledgerTable.ledgerId, ledgerId))
            .limit(1);

        if (!existingEntry) {
            return res.status(404).json({
                message: "Not found",
                error: "Ledger entry not found"
            });
        }

        await db.delete(ledgerTable)
            .where(eq(ledgerTable.ledgerId, ledgerId));

        // Recalculate balances after deletion
        await updateRunningBalances();

        res.status(200).json({
            success: true,
            message: "Ledger entry deleted successfully"
        });
    } catch (error: any) {
        console.error('Error while deleting ledger entry: ', error);
        res.status(500).json({
            message: "Error while deleting ledger entry",
            error: error.message
        });
    }
});

/**
 * GET /api/ledger/balance - Get current balance
 */
router.get('/balance', async (req, res) => {
    try {
        const balance = await getLatestBalance();
        res.status(200).json({
            success: true,
            balance: balance
        });
    } catch (error: any) {
        console.error('Error while getting balance: ', error);
        res.status(500).json({
            message: "Error while getting balance",
            error: error.message
        });
    }
});

/**
 * POST /api/ledger/generate-monthly-maintenance - Generate monthly maintenance entries for all flats
 * This creates credit entries for the current month's maintenance fees
 */
router.post('/generate-monthly-maintenance', async (req, res) => {
    try {
        const { month, year } = req.body; // Format: month: "01", year: "2024"

        if (!month || !year) {
            return res.status(400).json({
                message: "Validation error",
                error: "Month and year are required"
            });
        }

        // Get all occupied flats
        const { flatsTable } = await import('../db/schema');
        const occupiedFlats = await db.select()
            .from(flatsTable)
            .where(eq(flatsTable.status, 'occupied'));

        const dueDate = `${year}-${month}-01`;
        const entries = [];

        for (const flat of occupiedFlats) {
            // Get primary resident for the flat
            const { residentsTable } = await import('../db/schema');
            const [primaryResident] = await db.select()
                .from(residentsTable)
                .where(
                    and(
                        eq(residentsTable.flatId, flat.flatId),
                        eq(residentsTable.isPrimaryTenant, true)
                    )
                )
                .limit(1);

            if (primaryResident && flat.monthlyMaintenanceCharge) {
                const amount = parseFloat(flat.monthlyMaintenanceCharge.toString());
                entries.push({
                    transactionDate: dueDate,
                    entryType: 'credit',
                    category: 'maintenance',
                    flatId: flat.flatId,
                    residentId: primaryResident.residentId,
                    dueDate: dueDate,
                    amount: amount.toString(),
                    status: 'pending',
                });
            }
        }

        // Insert all entries
        if (entries.length > 0) {
            const insertedEntries = await db.insert(ledgerTable)
                .values(entries as InferInsertModel<typeof ledgerTable>[])
                .returning();

            res.status(201).json({
                success: true,
                message: `Generated ${insertedEntries.length} monthly maintenance entries`,
                data: insertedEntries
            });
        } else {
            res.status(200).json({
                success: true,
                message: "No entries generated",
                data: []
            });
        }
    } catch (error: any) {
        console.error('Error while generating monthly maintenance: ', error);
        res.status(500).json({
            message: "Error while generating monthly maintenance",
            error: error.message
        });
    }
});

/**
 * Helper function to get the latest balance
 */
async function getLatestBalance(): Promise<number> {
    // Calculate balance from all entries
    const [creditTotal] = await db.select({
        total: sql<number>`COALESCE(SUM(${ledgerTable.amount}), 0)`
    })
        .from(ledgerTable)
        .where(eq(ledgerTable.entryType, 'credit'));

    const [debitTotal] = await db.select({
        total: sql<number>`COALESCE(SUM(${ledgerTable.amount}), 0)`
    })
        .from(ledgerTable)
        .where(eq(ledgerTable.entryType, 'debit'));

    return (creditTotal?.total || 0) - (debitTotal?.total || 0);
}

/**
 * Update running balances for all ledger entries
 * This recalculates balances chronologically
 */
async function updateRunningBalances(): Promise<void> {
    // Get all entries ordered by creation date
    const entries = await db.select()
        .from(ledgerTable)
        .orderBy(ledgerTable.createdAt);

    let runningBalance = 0;

    // Update each entry's running balance
    for (const entry of entries) {
        const amount = parseFloat(entry.amount.toString());
        runningBalance = entry.entryType === 'credit'
            ? runningBalance + amount
            : runningBalance - amount;

        await db.update(ledgerTable)
            .set({
                runningBalance: sql`${runningBalance}`,
            } as any)
            .where(eq(ledgerTable.ledgerId, entry.ledgerId));
    }
}

export default router;

