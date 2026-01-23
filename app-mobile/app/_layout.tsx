import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const unstable_settings = {
  anchor: "(admin-tabs)",
  // Fallback to resident-tabs if admin-tabs is not available
};

// Move all Stack.Screen options outside to prevent recreation
const indexScreenOptions = { headerShown: false };
const loginScreenOptions = { headerShown: false };
const adminTabsScreenOptions = { headerShown: false };
const residentTabsScreenOptions = { headerShown: false };
const modalScreenOptions = { presentation: "modal" as const, title: "Modal" };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initialize = useAuthStore((state) => state.initialize);

  // Memoize theme value to prevent recreation
  const theme = useMemo(
    () => (colorScheme === "dark" ? DarkTheme : DefaultTheme),
    [colorScheme]
  );

  // Initialize auth store on app start - only once
  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <ThemeProvider value={theme}>
            <Stack>
          <Stack.Screen name="index" options={indexScreenOptions} />
          <Stack.Screen name="login" options={loginScreenOptions} />

          {/* Admin Layout */}
          <Stack.Screen name="(admin-tabs)" options={adminTabsScreenOptions} />

          {/* Resident Layout */}
          <Stack.Screen
            name="(resident-tabs)"
            options={residentTabsScreenOptions}
          />

          {/* Shared screens accessible from both layouts */}
          <Stack.Screen name="modal" options={modalScreenOptions} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </KeyboardProvider>
    </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
