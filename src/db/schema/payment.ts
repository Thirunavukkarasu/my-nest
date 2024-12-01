import { pgTable, serial, varchar, integer, decimal, timestamp, date, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { flatsTable } from "./flat";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const paymentsTable = pgTable("payments", {
    paymentId: serial("payment_id").primaryKey(),
    flatId: integer("flat_id").notNull().references(() => flatsTable.flatId, { onDelete: "cascade" }),
    paymentType: varchar("payment_type", { length: 20 }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentDate: date("payment_date").notNull(),
    dueDate: date("due_date"),
    status: varchar("status", { length: 20 }),
    paymentMethod: varchar("payment_method", { length: 50 }),
    referenceNumber: varchar("reference_number", { length: 100 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
    flat: one(flatsTable, { fields: [paymentsTable.flatId], references: [flatsTable.flatId] }),
}));

export const paymentSchema = createInsertSchema(paymentsTable);
export type PaymentSchema = z.infer<typeof paymentSchema>;