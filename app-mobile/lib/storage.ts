/**
 * Storage utility for persisting data in the mobile app
 * Uses AsyncStorage for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const storage = {
    // Token management
    async setToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    },

    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    async removeToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    },

    // User data management
    async setUser(user: any): Promise<void> {
        try {
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user:', error);
        }
    },

    async getUser(): Promise<any | null> {
        try {
            const userData = await AsyncStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    async removeUser(): Promise<void> {
        try {
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    },

    // Clear all auth data
    async clearAuth(): Promise<void> {
        await Promise.all([
            this.removeToken(),
            this.removeUser()
        ]);
    }
};

