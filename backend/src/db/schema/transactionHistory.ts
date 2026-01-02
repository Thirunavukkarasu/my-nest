import { relations } from "drizzle-orm";
import { decimal, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { expensesTable } from "./expense"; // Import the expenses table
import { paymentsTable } from "./payment"; // Import the payments table

export const transactionHistoryTable = pgTable("transaction_history", {
    transactionId: serial("transaction_id").primaryKey(),  // Unique transaction identifier
    apartmentId: varchar("apartment_id", { length: 255 }).notNull(),  // apartment_id as a string (VARCHAR)
    transactionType: varchar("transaction_type", { length: 50 }).notNull(), // "Payment" or "Expense"
    paymentId: integer("payment_id"),  // Foreign key to payments table (nullable for expenses)
    expenseId: integer("expense_id"),  // Foreign key to expenses table (nullable for payments)
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),  // Amount for the transaction
    outstandingBalance: decimal("outstanding_balance", { precision: 12, scale: 2 }).notNull(),  // Running balance
    description: text("description"),  // Optional description
    createdAt: timestamp("created_at").defaultNow(),  // Timestamp when the transaction was created
});

// Define relations with the payments and expenses tables
export const transactionHistoryRelations = relations(transactionHistoryTable, ({ one }) => ({
    payment: one(paymentsTable, {
        fields: [transactionHistoryTable.paymentId],  // Foreign key in transaction_history
        references: [paymentsTable.paymentId],  // Primary key in paymentsTable
    }),
    expense: one(expensesTable, {
        fields: [transactionHistoryTable.expenseId],  // Foreign key in transaction_history
        references: [expensesTable.expenseId],  // Primary key in expensesTable
    }),
}));

export const transactionHistorySchema = createInsertSchema(transactionHistoryTable);
export type TransactionHistorySchema = z.infer<typeof transactionHistorySchema>;

