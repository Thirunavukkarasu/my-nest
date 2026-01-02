import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { rolePermissionsTable } from "./rolePermission";
import { usersTable } from "./user";

/**
 * Roles Table
 * Defines different roles in the system (e.g., Admin, Manager, Resident, etc.)
 */
export const rolesTable = pgTable("roles", {
    roleId: serial("role_id").primaryKey(),
    roleName: varchar("role_name", { length: 50 }).notNull().unique(),
    description: varchar("description", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Define Relationships
export const rolesRelations = relations(rolesTable, ({ many }) => ({
    users: many(usersTable),
    rolePermissions: many(rolePermissionsTable),
}));

export const roleSchema = createInsertSchema(rolesTable);
export type RoleSchema = z.infer<typeof roleSchema>;

