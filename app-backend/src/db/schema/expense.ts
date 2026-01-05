import { date, decimal, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expensesTable = pgTable('expenses', {
    expenseId: serial('expense_id').notNull().primaryKey(),
    expenseDate: date('expense_date').notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    description: text('description'),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    paidBy: varchar('paid_by', { length: 100 }),
    paymentMethod: varchar('payment_method', { length: 50 }),
    receiptUrl: varchar('receipt_url', { length: 255 }),
    status: varchar('status', { length: 20 })
        .default('Pending')
        .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

export const expenseSchema = createInsertSchema(expensesTable);
export type ExpenseSchema = z.infer<typeof expenseSchema>;

