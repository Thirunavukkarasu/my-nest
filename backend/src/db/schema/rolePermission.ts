import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { permissionsTable } from "./permission";
import { rolesTable } from "./role";

/**
 * Role Permissions Mapping Table
 * Many-to-many relationship between roles and permissions
 */
export const rolePermissionsTable = pgTable(
    "role_permissions",
    {
        roleId: integer("role_id")
            .notNull()
            .references(() => rolesTable.roleId, { onDelete: "cascade" }),
        permissionId: integer("permission_id")
            .notNull()
            .references(() => permissionsTable.permissionId, { onDelete: "cascade" }),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    })
);

// Define Relationships
export const rolePermissionsRelations = relations(rolePermissionsTable, ({ one }) => ({
    role: one(rolesTable, {
        fields: [rolePermissionsTable.roleId],
        references: [rolesTable.roleId],
    }),
    permission: one(permissionsTable, {
        fields: [rolePermissionsTable.permissionId],
        references: [permissionsTable.permissionId],
    }),
}));

