/**
 * Logout Hook
 * Provides a reusable logout function that clears all authentication data
 */
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export function useLogout() {
    const router = useRouter();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const logout = async (showConfirmation: boolean = true) => {
        const performLogout = async () => {
            try {
                // Clear API client token
                await apiClient.clearAuth();

                // Clear auth store (this also clears storage via Zustand persist)
                await clearAuth();

                // Navigate to login
                router.replace('/login');
            } catch (error) {
                console.error('Error during logout:', error);
                // Even if there's an error, try to navigate to login
                router.replace('/login');
            }
        };

        if (showConfirmation) {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: performLogout,
                },
            ]);
        } else {
            await performLogout();
        }
    };

    return { logout };
}

