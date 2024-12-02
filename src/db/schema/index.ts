import { flatsRelations } from "@/db/schema/flat";
import { residentsRelations } from "@/db/schema/resident";
import { paymentsRelations } from "@/db/schema/payment";

// Create relations map
export const relations: any = {
    flat: flatsRelations,
    resident: residentsRelations,
    payment: paymentsRelations
};

export { flatsTable, flatsRelations } from "@/db/schema/flat";
export { residentsTable, residentsRelations } from "@/db/schema/resident";
export { paymentsTable, paymentsRelations } from "@/db/schema/payment";
export { usersTable } from "@/db/schema/user";
export { expensesTable } from "@/db/schema/expense";