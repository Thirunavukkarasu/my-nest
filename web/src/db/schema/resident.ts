import { pgTable, serial, varchar, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { flatsTable } from "./flat";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const residentsTable = pgTable("residents", {
    residentId: serial("resident_id").primaryKey(),
    flatId: integer("flat_id").notNull().references(() => flatsTable.flatId, { onDelete: "cascade" }),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).unique(),
    phone: varchar("phone", { length: 20 }),
    leaseStartDate: date("lease_start_date").notNull(),
    leaseEndDate: date("lease_end_date"),
    isPrimaryTenant: boolean("is_primary_tenant").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const residentsRelations = relations(residentsTable, ({ one }) => ({
    flat: one(flatsTable, { fields: [residentsTable.flatId], references: [flatsTable.flatId] }),
}));


export const residentSchema = createInsertSchema(residentsTable);
export type ResidentSchema = z.infer<typeof residentSchema>;