/**
 * Admin Tabs Layout
 * Navigation for admin users with full access to all features
 */
import { Tabs } from "expo-router";
import React from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

// Icon functions defined outside component to prevent recreation
// These must be functions (not memoized components) for React Navigation
const DashboardIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="chart.bar.fill" color={color} />
);
const FlatsIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="building.2.fill" color={color} />
);
const ResidentsIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="person.2.fill" color={color} />
);
const PaymentsIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="creditcard.fill" color={color} />
);
const SettingsIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="gearshape.fill" color={color} />
);

// Move all options outside component to prevent recreation on each render
const screenOptions = {
  tabBarActiveTintColor: Colors.light.tint,
  headerShown: false,
};

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

const paymentsOptions = {
  title: "Payments",
  tabBarIcon: PaymentsIcon,
};

const settingsOptions = {
  title: "Settings",
  tabBarIcon: SettingsIcon,
};

export default function AdminTabLayout() {
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={dashboardOptions} />
      <Tabs.Screen name="flats" options={flatsOptions} />
      <Tabs.Screen name="residents" options={residentsOptions} />
      <Tabs.Screen name="payments" options={paymentsOptions} />
      <Tabs.Screen name="settings" options={settingsOptions} />
    </Tabs>
  );
}
