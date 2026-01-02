import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  anchor: "(admin-tabs)",
  // Fallback to resident-tabs if admin-tabs is not available
};

// Move all Stack.Screen options outside to prevent recreation
const indexScreenOptions = { headerShown: false };
const loginScreenOptions = { headerShown: false };
const adminTabsScreenOptions = { headerShown: false };
const residentTabsScreenOptions = { headerShown: false };
const flatsScreenOptions = {
  title: "Flats",
  headerStyle: { backgroundColor: "#fff" },
  headerTintColor: "#000",
};
const flatDetailScreenOptions = {
  title: "Flat Details",
  headerStyle: { backgroundColor: "#fff" },
  headerTintColor: "#000",
};
const residentsScreenOptions = {
  title: "Residents",
  headerStyle: { backgroundColor: "#fff" },
  headerTintColor: "#000",
};
const paymentsScreenOptions = {
  title: "Payments",
  headerStyle: { backgroundColor: "#fff" },
  headerTintColor: "#000",
};
const complaintsScreenOptions = {
  title: "Complaints",
  headerStyle: { backgroundColor: "#fff" },
  headerTintColor: "#000",
};
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
        <Stack.Screen name="flats" options={flatsScreenOptions} />
        <Stack.Screen name="flats/[id]" options={flatDetailScreenOptions} />
        <Stack.Screen name="residents" options={residentsScreenOptions} />
        <Stack.Screen name="payments" options={paymentsScreenOptions} />
        <Stack.Screen name="complaints" options={complaintsScreenOptions} />
        <Stack.Screen name="modal" options={modalScreenOptions} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
