/**
 * Auth & Permissions Store using Zustand
 * Manages user authentication state and permissions globally
 */

import type { Permission } from '@/lib/permissions';
import { storage } from '@/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
    id: number;
    name: string;
    email: string;
    mobile?: string | null;
    roleId?: number | null;
    roleName?: string | null;
    createdAt?: string;
}

export interface AuthState {
    // State
    user: User | null;
    token: string | null;
    permissions: string[];
    isAuthenticated: boolean;

    // Actions
    setAuth: (user: User, token: string, permissions: string[]) => void;
    setPermissions: (permissions: string[]) => void;
    clearAuth: () => Promise<void>;
    hasPermission: (permission: Permission | string) => boolean;
    hasAnyPermission: (permissions: Permission[] | string[]) => boolean;
    hasAllPermissions: (permissions: Permission[] | string[]) => boolean;

    // Initialization
    initialize: () => Promise<void>;
}

/**
 * Type for selecting specific parts of the auth store
 * Useful for type-safe selectors in hooks
 */
export type AuthStoreSelector = (state: AuthState) => any;

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            token: null,
            permissions: [],
            isAuthenticated: false,

            // Set authentication data
            setAuth: (user, token, permissions) => {
                set({
                    user,
                    token,
                    permissions,
                    isAuthenticated: true,
                });
                // Also update storage for backward compatibility
                storage.setToken(token);
                storage.setUser({ ...user, permissions });
            },

            // Update permissions only
            setPermissions: (permissions) => {
                set({ permissions });
                const { user } = get();
                if (user) {
                    storage.setUser({ ...user, permissions });
                }
            },

            // Clear authentication
            clearAuth: async () => {
                await storage.clearAuth();
                set({
                    user: null,
                    token: null,
                    permissions: [],
                    isAuthenticated: false,
                });
            },

            // Check if user has a specific permission
            hasPermission: (permission) => {
                const { permissions } = get();
                return permissions.includes(permission);
            },

            // Check if user has any of the specified permissions
            hasAnyPermission: (requiredPermissions) => {
                const { permissions } = get();
                return requiredPermissions.some(permission =>
                    permissions.includes(permission)
                );
            },

            // Check if user has all of the specified permissions
            hasAllPermissions: (requiredPermissions) => {
                const { permissions } = get();
                return requiredPermissions.every(permission =>
                    permissions.includes(permission)
                );
            },

            // Initialize store from storage
            // Note: Zustand's persist middleware automatically restores state
            // This function is for backward compatibility with old storage system
            initialize: async () => {
                try {
                    const currentState = get();

                    // If Zustand has already restored state, don't overwrite it
                    if (currentState.isAuthenticated && currentState.user && currentState.token) {
                        return;
                    }

                    // Otherwise, try to restore from old storage system
                    const token = await storage.getToken();
                    const userData = await storage.getUser();

                    if (token && userData) {
                        set({
                            token,
                            user: {
                                id: userData.id,
                                name: userData.name,
                                email: userData.email,
                                mobile: userData.mobile,
                                roleId: userData.roleId,
                                roleName: userData.roleName,
                                createdAt: userData.createdAt,
                            },
                            permissions: userData.permissions || [],
                            isAuthenticated: true,
                        });
                    }
                } catch (error) {
                    console.error('Error initializing auth store:', error);
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist essential data
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                permissions: state.permissions,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

