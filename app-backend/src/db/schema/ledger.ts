import { relations } from "drizzle-orm";
import { date, decimal, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { flatsTable } from "./flat";
import { residentsTable } from "./resident";
import { usersTable } from "./user";

/**
 * Unified Ledger Table
 * Tracks all financial transactions (credits and debits) in a single table
 * 
 * Credits (Income):
 * - Monthly maintenance fees from residents
 * - Any other income sources
 * 
 * Debits (Expenses):
 * - Security payments
 * - Cleaning services
 * - Utilities (water, electricity)
 * - Repairs and maintenance
 * - Any other expenses
 */
export const ledgerTable = pgTable("ledger", {
    ledgerId: serial("ledger_id").primaryKey(),

    // Transaction details
    transactionDate: date("transaction_date").notNull(),
    entryType: varchar("entry_type", { length: 10 }).notNull(), // 'credit' or 'debit'
    category: varchar("category", { length: 50 }).notNull(), // 'maintenance', 'security', 'cleaning', 'utilities', 'repairs', etc.

    // For Credits (Income) - Monthly maintenance from residents
    flatId: integer("flat_id").references(() => flatsTable.flatId, { onDelete: "set null" }),
    residentId: integer("resident_id").references(() => residentsTable.residentId, { onDelete: "set null" }),
    dueDate: date("due_date"), // For monthly maintenance - when payment is due

    // For Debits (Expenses)
    expenseCategory: varchar("expense_category", { length: 50 }), // More specific category for expenses
    paidBy: varchar("paid_by", { length: 100 }), // Who paid the expense

    // Common fields
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(), // Always positive, entryType determines credit/debit
    description: text("description"),
    paymentMethod: varchar("payment_method", { length: 50 }), // 'upi', 'cash', 'bank_transfer', 'cheque', etc.
    referenceNumber: varchar("reference_number", { length: 100 }),
    receiptUrl: varchar("receipt_url", { length: 255 }),
    status: varchar("status", { length: 20 }).default("pending").notNull(), // 'pending', 'completed', 'cancelled', 'overdue'

    // Balance tracking (can be computed on-demand or stored for performance)
    runningBalance: decimal("running_balance", { precision: 12, scale: 2 }),

    // Metadata
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    createdBy: integer("created_by").references(() => usersTable.id, { onDelete: "set null" }),
});

// Define relations
export const ledgerRelations = relations(ledgerTable, ({ one }) => ({
    flat: one(flatsTable, {
        fields: [ledgerTable.flatId],
        references: [flatsTable.flatId],
    }),
    resident: one(residentsTable, {
        fields: [ledgerTable.residentId],
        references: [residentsTable.residentId],
    }),
    creator: one(usersTable, {
        fields: [ledgerTable.createdBy],
        references: [usersTable.id],
    }),
}));

export const ledgerSchema = createInsertSchema(ledgerTable, {
    entryType: z.enum(["credit", "debit"]),
    status: z.enum(["pending", "completed", "cancelled", "overdue"]).default("pending"),
});

export type LedgerSchema = z.infer<typeof ledgerSchema>;

