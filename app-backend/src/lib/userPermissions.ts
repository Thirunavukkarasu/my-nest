/**
 * User Permissions Helper
 * Functions to fetch and check user permissions
 */
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { permissionsTable, rolePermissionsTable, rolesTable, usersTable } from '../db/schema';

/**
 * Get all permissions for a user based on their role
 */
export async function getUserPermissions(userId: number): Promise<string[]> {
    try {
        // Get user with role
        const [user] = await db
            .select({
                userId: usersTable.id,
                roleId: usersTable.roleId,
            })
            .from(usersTable)
            .where(eq(usersTable.id, userId))
            .limit(1);

        if (!user || !user.roleId) {
            return []; // No role assigned, no permissions
        }

        // Get permissions for the role
        const permissions = await db
            .select({
                permissionName: permissionsTable.permissionName,
            })
            .from(rolePermissionsTable)
            .innerJoin(
                permissionsTable,
                eq(rolePermissionsTable.permissionId, permissionsTable.permissionId)
            )
            .where(eq(rolePermissionsTable.roleId, user.roleId));

        return permissions.map(p => p.permissionName);
    } catch (error) {
        console.error('Error fetching user permissions:', error);
        return [];
    }
}

/**
 * Get user with role and permissions
 */
export async function getUserWithPermissions(userId: number) {
    try {
        // Get user with role
        const [user] = await db
            .select({
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
                mobile: usersTable.mobile,
                roleId: usersTable.roleId,
                roleName: rolesTable.roleName,
                createdAt: usersTable.createdAt,
            })
            .from(usersTable)
            .leftJoin(rolesTable, eq(usersTable.roleId, rolesTable.roleId))
            .where(eq(usersTable.id, userId))
            .limit(1);

        if (!user) {
            return null;
        }

        // Get permissions if role exists
        let permissions: string[] = [];
        if (user.roleId) {
            const permissionResults = await db
                .select({
                    permissionName: permissionsTable.permissionName,
                })
                .from(rolePermissionsTable)
                .innerJoin(
                    permissionsTable,
                    eq(rolePermissionsTable.permissionId, permissionsTable.permissionId)
                )
                .where(eq(rolePermissionsTable.roleId, user.roleId));

            permissions = permissionResults.map(p => p.permissionName);
        }

        return {
            ...user,
            permissions,
        };
    } catch (error) {
        console.error('Error fetching user with permissions:', error);
        return null;
    }
}

/**
 * Check if user has a specific permission
 */
export async function userHasPermission(userId: number, permission: string): Promise<boolean> {
    const permissions = await getUserPermissions(userId);
    return permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export async function userHasAnyPermission(userId: number, requiredPermissions: string[]): Promise<boolean> {
    const permissions = await getUserPermissions(userId);
    return requiredPermissions.some(permission => permissions.includes(permission));
}

/**
 * Check if user has all of the specified permissions
 */
export async function userHasAllPermissions(userId: number, requiredPermissions: string[]): Promise<boolean> {
    const permissions = await getUserPermissions(userId);
    return requiredPermissions.every(permission => permissions.includes(permission));
}

