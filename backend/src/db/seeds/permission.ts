import type { InferInsertModel } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PERMISSIONS } from "../../lib/permissions";
import * as schema from "../schema";
import { permissionsTable } from "../schema/permission";

type DB = NodePgDatabase<typeof schema>;

/**
 * Parse permission name to extract module and action
 * Format: MYNEST.MODULE.ACTION
 * Example: "MYNEST.LEDGER.VIEW" -> { module: "LEDGER", action: "VIEW" }
 */
function parsePermission(permissionName: string): { module: string; action: string } {
    const parts = permissionName.split('.');
    if (parts.length >= 3 && parts[0] === 'MYNEST') {
        return {
            module: parts[1],
            action: parts.slice(2).join('.'), // Handle actions like "GENERATE_MAINTENANCE"
        };
    }
    // Fallback: try to extract from permission name
    return {
        module: parts[1] || '',
        action: parts.slice(2).join('.') || '',
    };
}

/**
 * Generate description for a permission based on module and action
 */
function generateDescription(module: string, action: string): string {
    const actionMap: Record<string, string> = {
        VIEW: 'View',
        CREATE: 'Create',
        UPDATE: 'Update',
        DELETE: 'Delete',
        ASSIGN: 'Assign',
        EXPORT: 'Export',
        GENERATE_MAINTENANCE: 'Generate Monthly Maintenance',
        VIEW_BALANCE: 'View Balance',
    };

    const actionLabel = actionMap[action] || action.replace(/_/g, ' ');
    return `${actionLabel} ${module.toLowerCase()}`;
}

/**
 * Seed permissions from PERMISSIONS constant
 */
export async function seed(db: DB) {
    console.log('🌱 Seeding permissions...');

    const allPermissions = Object.values(PERMISSIONS).flatMap(modulePermissions =>
        Object.values(modulePermissions)
    );

    let inserted = 0;
    let skipped = 0;

    for (const permissionName of allPermissions) {
        const { module, action } = parsePermission(permissionName);
        const description = generateDescription(module, action);

        try {
            // Try to insert, skip if already exists (unique constraint)
            await db.insert(permissionsTable).values({
                permissionName,
                module,
                action,
                description,
            } as InferInsertModel<typeof permissionsTable>);

            inserted++;
        } catch (error: any) {
            // If it's a unique constraint error, skip it (permission already exists)
            if (error.code === '23505') {
                skipped++;
            } else {
                console.error(`Error inserting permission ${permissionName}:`, error);
                throw error;
            }
        }
    }

    console.log(`✅ Permissions seeded: ${inserted} inserted, ${skipped} already existed`);
}

