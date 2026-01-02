import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { rolePermissionsTable } from "./rolePermission";

/**
 * Permissions Table
 * Defines granular permissions in the system
 * Format: MYNEST.MODULE.ACTION (e.g., MYNEST.LEDGER.VIEW, MYNEST.LEDGER.CREATE)
 */
export const permissionsTable = pgTable("permissions", {
    permissionId: serial("permission_id").primaryKey(),
    permissionName: varchar("permission_name", { length: 100 }).notNull().unique(),
    description: varchar("description", { length: 255 }),
    module: varchar("module", { length: 50 }), // e.g., 'LEDGER', 'FLATS', 'RESIDENTS'
    action: varchar("action", { length: 50 }), // e.g., 'VIEW', 'CREATE', 'UPDATE', 'DELETE'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Define Relationships
export const permissionsRelations = relations(permissionsTable, ({ many }) => ({
    rolePermissions: many(rolePermissionsTable),
}));

export const permissionSchema = createInsertSchema(permissionsTable);
export type PermissionSchema = z.infer<typeof permissionSchema>;

