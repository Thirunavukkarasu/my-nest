import { relations } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { rolesTable } from "./role";

export const usersTable = pgTable('users', {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    mobile: varchar('mobile', { length: 10 }),
    password: varchar('password', { length: 255 }).notNull(),
    roleId: integer('role_id').references(() => rolesTable.roleId, { onDelete: "set null" }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Define Relationships
export const usersRelations = relations(usersTable, ({ one }) => ({
    role: one(rolesTable, {
        fields: [usersTable.roleId],
        references: [rolesTable.roleId],
    }),
}));

export const userSchema = createInsertSchema(usersTable);
export type UserSchema = z.infer<typeof userSchema>;

