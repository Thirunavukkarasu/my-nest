import { relations } from "drizzle-orm";
import { date, decimal, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { flatsTable } from "./flat";
import { residentsTable } from "./resident";

export const paymentsTable = pgTable("payments", {
    paymentId: serial("payment_id").primaryKey(),
    flatId: integer("flat_id").notNull().references(() => flatsTable.flatId, { onDelete: "cascade" }),
    residentId: integer("resident_id").notNull().references(() => residentsTable.residentId, { onDelete: "cascade" }),
    paymentType: varchar("payment_type", { length: 20 }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentDate: date("payment_date").notNull(),
    dueDate: date("due_date"),
    status: varchar("status", { length: 20 }),
    paymentMethod: varchar("payment_method", { length: 50 }),
    referenceNumber: varchar("reference_number", { length: 100 }),
    receiptUrl: varchar("receipt_url", { length: 255 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
    flat: one(flatsTable, {
        fields: [paymentsTable.flatId], // Foreign key in `paymentsTable`
        references: [flatsTable.flatId], // Primary key in `flatsTable`
    }),
    resident: one(residentsTable, {
        fields: [paymentsTable.residentId], // Foreign key in `paymentsTable`
        references: [residentsTable.residentId], // Primary key in `residentsTable`
    }),
}));

export const paymentSchema = createInsertSchema(paymentsTable);
export type PaymentSchema = z.infer<typeof paymentSchema>;

