import { relations } from "drizzle-orm";
import { boolean, date, index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { flatsTable } from "./flat";

export const residentsTable = pgTable("residents", {
    residentId: serial("resident_id").primaryKey(),
    flatId: integer("flat_id").notNull().references(() => flatsTable.flatId, { onDelete: "cascade" }),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).unique(),
    phone: varchar("phone", { length: 20 }),
    dateOfBirth: date("date_of_birth"), // For age calculation (senior citizens, minors)
    residentType: varchar("resident_type", { length: 10 }).default("tenant"), // 'owner' | 'tenant'
    status: varchar("status", { length: 20 }).default("active").notNull(), // 'active' | 'archived' | 'pending' | 'inactive'
    leaseStartDate: date("lease_start_date").notNull(),
    leaseEndDate: date("lease_end_date"), // NULL = current resident, has value = past resident
    isPrimaryTenant: boolean("is_primary_tenant").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    // Index on flatId for fast queries when fetching all residents for a flat
    flatIdIdx: index("residents_flat_id_idx").on(table.flatId),
    // Index on lease dates for historical queries (e.g., tenants in last 5 years)
    leaseDatesIdx: index("residents_lease_dates_idx").on(table.leaseStartDate, table.leaseEndDate),
    // Index on residentType for filtering owners vs tenants
    residentTypeIdx: index("residents_type_idx").on(table.residentType),
    // Index on status for filtering active/archived residents
    statusIdx: index("residents_status_idx").on(table.status),
    // Composite index for common queries (flat + status)
    flatStatusIdx: index("residents_flat_status_idx").on(table.flatId, table.status),
}));

export const residentsRelations = relations(residentsTable, ({ one }) => ({
    flat: one(flatsTable, { fields: [residentsTable.flatId], references: [flatsTable.flatId] }),
}));


export const residentSchema = createInsertSchema(residentsTable, {
    residentType: z.enum(["owner", "tenant"]).default("tenant"),
    status: z.enum(["active", "archived", "pending", "inactive"]).default("active"),
});
export type ResidentSchema = z.infer<typeof residentSchema>;

