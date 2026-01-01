import { pgTable, serial, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { residentsTable } from "./resident";
import { paymentsTable } from "./payment";

// Flats Table
export const flatsTable = pgTable("flats", {
    flatId: serial("flat_id").primaryKey(),
    flatNumber: varchar("flat_number", { length: 10 }).notNull().unique(),
    floorNumber: integer("floor_number").notNull(),
    bedrooms: integer("bedrooms").default(1),
    bathrooms: integer("bathrooms").default(1),
    totalArea: decimal("total_area", { precision: 8, scale: 2 }).default("1200.00"),
    balcony: boolean("balcony").default(false),
    status: varchar("status", { length: 10 }),
    monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).default("0"),
    monthlyMaintenanceCharge: decimal("monthly_maintenance_charge", { precision: 10, scale: 2 }).default("2000"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Define Relationships
export const flatsRelations = relations(flatsTable, ({ many }) => ({
    residents: many(residentsTable),
    payments: many(paymentsTable),
}));

export const flatSchema = createInsertSchema(flatsTable);
export type FlatSchema = z.infer<typeof flatSchema>;