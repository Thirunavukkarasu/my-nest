/**
 * Resident Tabs Layout
 * Navigation for resident users with limited access
 */
import { Tabs } from "expo-router";
import React from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

// Icon functions defined outside component to prevent recreation
// These must be functions (not memoized components) for React Navigation
const HomeIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="house.fill" color={color} />
);
const MyFlatIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="building.2.fill" color={color} />
);
const PaymentsIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="creditcard.fill" color={color} />
);
const ComplaintsIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="exclamationmark.triangle.fill" color={color} />
);
const ProfileIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="person.fill" color={color} />
);

// Move all options outside component to prevent recreation on each render
const screenOptions = {
  tabBarActiveTintColor: Colors.light.tint,
  headerShown: false,
};

const homeOptions = {
  title: "Home",
  tabBarIcon: HomeIcon,
};

const myFlatOptions = {
  title: "My Flat",
  tabBarIcon: MyFlatIcon,
};

const paymentsOptions = {
  title: "Payments",
  tabBarIcon: PaymentsIcon,
};

const complaintsOptions = {
  title: "Complaints",
  tabBarIcon: ComplaintsIcon,
};

const profileOptions = {
  title: "Profile",
  tabBarIcon: ProfileIcon,
};

export default function ResidentTabLayout() {
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={homeOptions} />
      <Tabs.Screen name="my-flat" options={myFlatOptions} />
      <Tabs.Screen name="payments" options={paymentsOptions} />
      <Tabs.Screen name="complaints" options={complaintsOptions} />
      <Tabs.Screen name="profile" options={profileOptions} />
    </Tabs>
  );
}
