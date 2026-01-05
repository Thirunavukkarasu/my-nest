/**
 * Permission Check Hook
 * Provides convenient hooks for checking user permissions
 */

import type { Permission } from '@/lib/permissions';
import { useAuthStore, type AuthState } from '@/store/authStore';

/**
 * Hook to check if user has a specific permission
 */
export const useHasPermission = (permission: Permission | string): boolean => {
    const hasPermission = useAuthStore((state: AuthState) => state.hasPermission);
    return hasPermission(permission);
};

/**
 * Hook to check if user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions: Permission[] | string[]): boolean => {
    const hasAnyPermission = useAuthStore((state: AuthState) => state.hasAnyPermission);
    return hasAnyPermission(permissions);
};

/**
 * Hook to check if user has all of the specified permissions
 */
export const useHasAllPermissions = (permissions: Permission[] | string[]): boolean => {
    const hasAllPermissions = useAuthStore((state: AuthState) => state.hasAllPermissions);
    return hasAllPermissions(permissions);
};

/**
 * Hook to get all user permissions
 */
export const usePermissions = (): string[] => {
    return useAuthStore((state: AuthState) => state.permissions);
};

/**
 * Hook to get user data
 */
export const useUser = () => {
    return useAuthStore((state: AuthState) => state.user);
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
    return useAuthStore((state: AuthState) => state.isAuthenticated);
};

