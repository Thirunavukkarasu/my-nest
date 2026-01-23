import { relations } from "drizzle-orm";
import { index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { flatsTable } from "./flat";
import { residentsTable } from "./resident";

export const vehiclesTable = pgTable("vehicles", {
    vehicleId: serial("vehicle_id").primaryKey(),
    flatId: integer("flat_id").notNull().references(() => flatsTable.flatId, { onDelete: "cascade" }),
    residentId: integer("resident_id").references(() => residentsTable.residentId, { onDelete: "set null" }), // Optional - vehicle can belong to flat or specific resident
    vehicleType: varchar("vehicle_type", { length: 20 }).notNull(), // 'car', 'bike', 'scooty', 'bicycle'
    fuelType: varchar("fuel_type", { length: 20 }), // 'petrol', 'diesel', 'electric', 'none' (for bicycles)
    registrationNumber: varchar("registration_number", { length: 50 }), // Vehicle registration number
    make: varchar("make", { length: 50 }), // e.g., "Honda", "Toyota"
    model: varchar("model", { length: 50 }), // e.g., "Civic", "Activa"
    color: varchar("color", { length: 30 }), // Vehicle color
    status: varchar("status", { length: 20 }).default("active").notNull(), // 'active' | 'archived' | 'removed'
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
    // Index on flatId for fast queries when fetching all vehicles for a flat
    flatIdIdx: index("vehicles_flat_id_idx").on(table.flatId),
    // Index on residentId for queries by resident
    residentIdIdx: index("vehicles_resident_id_idx").on(table.residentId),
    // Index on vehicleType for filtering by type
    vehicleTypeIdx: index("vehicles_type_idx").on(table.vehicleType),
    // Index on status for filtering active vehicles
    statusIdx: index("vehicles_status_idx").on(table.status),
    // Composite index for common queries (flat + status)
    flatStatusIdx: index("vehicles_flat_status_idx").on(table.flatId, table.status),
}));

export const vehiclesRelations = relations(vehiclesTable, ({ one }) => ({
    flat: one(flatsTable, { fields: [vehiclesTable.flatId], references: [flatsTable.flatId] }),
    resident: one(residentsTable, { fields: [vehiclesTable.residentId], references: [residentsTable.residentId] }),
}));

export const vehicleSchema = createInsertSchema(vehiclesTable, {
    vehicleType: z.enum(["car", "bike", "scooty", "bicycle"]),
    fuelType: z.enum(["petrol", "diesel", "electric", "none"]).optional(),
    status: z.enum(["active", "archived", "removed"]).default("active"),
});
export type VehicleSchema = z.infer<typeof vehicleSchema>;
