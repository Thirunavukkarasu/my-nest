/**
 * Permission Constants
 * Centralized permission definitions following the pattern: MYNEST.MODULE.ACTION
 */

export const PERMISSIONS = {
    // Ledger Permissions
    LEDGER: {
        VIEW: 'MYNEST.LEDGER.VIEW',
        CREATE: 'MYNEST.LEDGER.CREATE',
        UPDATE: 'MYNEST.LEDGER.UPDATE',
        DELETE: 'MYNEST.LEDGER.DELETE',
    },

    // Flats Permissions
    FLATS: {
        VIEW: 'MYNEST.FLATS.VIEW',
        CREATE: 'MYNEST.FLATS.CREATE',
        UPDATE: 'MYNEST.FLATS.UPDATE',
        DELETE: 'MYNEST.FLATS.DELETE',
    },

    // Residents Permissions
    RESIDENTS: {
        VIEW: 'MYNEST.RESIDENTS.VIEW',
        CREATE: 'MYNEST.RESIDENTS.CREATE',
        UPDATE: 'MYNEST.RESIDENTS.UPDATE',
        DELETE: 'MYNEST.RESIDENTS.DELETE',
    },

    // Users Permissions
    USERS: {
        VIEW: 'MYNEST.USERS.VIEW',
        CREATE: 'MYNEST.USERS.CREATE',
        UPDATE: 'MYNEST.USERS.UPDATE',
        DELETE: 'MYNEST.USERS.DELETE',
    },

    // Roles & Permissions Management
    ROLES: {
        VIEW: 'MYNEST.ROLES.VIEW',
        CREATE: 'MYNEST.ROLES.CREATE',
        UPDATE: 'MYNEST.ROLES.UPDATE',
        DELETE: 'MYNEST.ROLES.DELETE',
        ASSIGN: 'MYNEST.ROLES.ASSIGN',
    },

    // Reports Permissions
    REPORTS: {
        VIEW: 'MYNEST.REPORTS.VIEW',
        EXPORT: 'MYNEST.REPORTS.EXPORT',
    },
} as const;

/**
 * Get all permission values as a flat array
 */
export const getAllPermissions = (): string[] => {
    return Object.values(PERMISSIONS).flatMap(module => Object.values(module));
};

/**
 * Get permissions by module
 */
export const getPermissionsByModule = (module: keyof typeof PERMISSIONS): string[] => {
    return Object.values(PERMISSIONS[module]);
};

/**
 * Check if a permission string is valid
 */
export const isValidPermission = (permission: string): boolean => {
    return getAllPermissions().includes(permission);
};

/**
 * Permission type for TypeScript
 */
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];

