/**
 * Admin Tabs Layout
 * Navigation for admin users with full access to all features
 */
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Icon functions defined outside component to prevent recreation
// These must be functions (not memoized components) for React Navigation
const DashboardIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="chart.bar.fill" color={color} />
);
const FlatsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="building.2.fill" color={color} />
);
const ResidentsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="person.2.fill" color={color} />
);
const LedgerIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="book.fill" color={color} />
);
const SettingsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="gearshape.fill" color={color} />
);

const dashboardOptions = {
  title: "Dashboard",
  tabBarIcon: DashboardIcon,
};

const flatsOptions = {
  title: "Flats",
  tabBarIcon: FlatsIcon,
};

const residentsOptions = {
  title: "Residents",
  tabBarIcon: ResidentsIcon,
};

const ledgerOptions = {
  title: "Ledger",
  tabBarIcon: LedgerIcon,
};

const settingsOptions = {
  title: "Settings",
  tabBarIcon: SettingsIcon,
};

export default function AdminTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? Colors.dark.tint : Colors.light.tint,
        tabBarInactiveTintColor: isDark ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: Platform.OS === "ios" ? 88 : 70,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen name="index" options={dashboardOptions} />
      <Tabs.Screen name="flats" options={flatsOptions} />
      <Tabs.Screen name="residents" options={residentsOptions} />
      <Tabs.Screen name="ledger" options={ledgerOptions} />
      <Tabs.Screen name="settings" options={settingsOptions} />
      <Tabs.Screen
        name="flats/[id]"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
