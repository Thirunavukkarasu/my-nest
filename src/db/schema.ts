import { pgTable, serial, varchar, integer, decimal, boolean, timestamp, date, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

// Residents Table
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

// Payments Table
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

// Define Relationships
export const flatsRelations = relations(flatsTable, ({ many }) => ({
    residents: many(residentsTable),
    payments: many(paymentsTable),
}));

export const residentsRelations = relations(residentsTable, ({ one }) => ({
    flat: one(flatsTable, { fields: [residentsTable.flatId], references: [flatsTable.flatId] }),
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
    flat: one(flatsTable, { fields: [paymentsTable.flatId], references: [flatsTable.flatId] }),
}));

// Users table schema
export const usersTable = pgTable('users', {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    mobile: varchar('mobile', { length: 10 }),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Expenses table schema
export const expensesTable = pgTable('expenses', {
    expenseId: serial('expense_id').notNull().primaryKey(),
    expenseDate: date('expense_date').notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    description: text('description'),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    paidBy: varchar('paid_by', { length: 100 }),
    paymentMethod: varchar('payment_method', { length: 50 }),
    receiptUrl: varchar('receipt_url', { length: 255 }),
    status: varchar('status', { length: 20 })
        .default('Pending')
        .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});
