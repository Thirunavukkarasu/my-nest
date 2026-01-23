/**
 * Resident Tabs Layout
 * Navigation for resident users with limited access
 */
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { adaptFlats, adaptResidents } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Flat, Resident } from "@/types";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Icon functions defined outside component to prevent recreation
// These must be functions (not memoized components) for React Navigation
const HomeIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="house.fill" color={color} />
);
const MyFlatIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="building.2.fill" color={color} />
);
const PaymentsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="creditcard.fill" color={color} />
);
const ComplaintsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="exclamationmark.triangle.fill" color={color} />
);
const ProfileIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol size={focused ? 26 : 24} name="person.fill" color={color} />
);

const homeOptions = {
  title: "Home",
  tabBarIcon: HomeIcon,
};

const myFlatOptions = {
  title: "My Flat",
  tabBarIcon: MyFlatIcon,
};

const paymentsOptions = {
  title: "Ledger",
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
  const isImpersonating = useAuthStore((state) => state.isImpersonating);
  const impersonatedFlatId = useAuthStore((state) => state.impersonatedFlatId);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const toggleImpersonate = useAuthStore((state) => state.toggleImpersonate);
  const [flat, setFlat] = useState<Flat | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loadingFlatData, setLoadingFlatData] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const roleName = user?.roleName?.toLowerCase();
  const isAdmin =
    roleName === "admin" || roleName === "administrator" || !roleName;
  const showImpersonationBanner = isImpersonating && isAdmin;

  useEffect(() => {
    if (showImpersonationBanner && impersonatedFlatId) {
      loadFlatData();
    } else {
      setFlat(null);
      setResidents([]);
    }
  }, [impersonatedFlatId, showImpersonationBanner]);

  const loadFlatData = async () => {
    if (!impersonatedFlatId) return;

    try {
      setLoadingFlatData(true);
      const response = await apiClient.getFlatById(impersonatedFlatId);

      if (response.error) {
        console.error("Error loading flat data:", response.error);
        return;
      }

      if (response.data?.data) {
        const apiFlat = response.data.data as any;
        const adaptedFlats = adaptFlats([apiFlat]);
        setFlat(adaptedFlats[0]);

        // Extract residents from the API response
        if (apiFlat.residents) {
          const adaptedResidents = adaptResidents(apiFlat.residents);
          setResidents(adaptedResidents);
        }
      }
    } catch (error) {
      console.error("Error loading flat data:", error);
    } finally {
      setLoadingFlatData(false);
    }
  };

  // Get primary resident/owner
  const primaryResident =
    residents.find((r) => r.type === "owner") || residents[0];

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      {showImpersonationBanner && (
        <View className="bg-yellow-500 px-4 py-2 border-b border-yellow-600">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <IconSymbol
                name="exclamationmark.triangle.fill"
                size={16}
                color="#FFFFFF"
              />
              <View className="flex-1 ml-2">
                <Text className="text-white text-sm font-medium">
                  Viewing as Resident
                </Text>
                {loadingFlatData ? (
                  <View className="flex-row items-center mt-0.5">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="text-white text-xs opacity-90 ml-1">
                      Loading...
                    </Text>
                  </View>
                ) : flat ? (
                  <View className="mt-0.5">
                    <Text className="text-white text-xs opacity-90">
                      Floor {flat.floor} - Flat {flat.flatNumber}
                    </Text>
                    {primaryResident && (
                      <Text className="text-white text-xs opacity-90 mt-0.5">
                        {primaryResident.name}
                        {primaryResident.type === "owner"
                          ? " (Owner)"
                          : " (Tenant)"}
                      </Text>
                    )}
                  </View>
                ) : impersonatedFlatId ? (
                  <Text className="text-white text-xs opacity-90 mt-0.5">
                    Flat ID: {impersonatedFlatId}
                  </Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                toggleImpersonate();
                router.replace("/(admin-tabs)" as any);
              }}
              className="bg-yellow-600 px-3 py-1 rounded"
            >
              <Text className="text-white text-xs font-semibold">
                Exit View
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
        <Tabs.Screen name="index" options={homeOptions} />
        <Tabs.Screen name="my-flat" options={myFlatOptions} />
        <Tabs.Screen name="payments" options={paymentsOptions} />
        <Tabs.Screen name="complaints" options={complaintsOptions} />
        <Tabs.Screen name="profile" options={profileOptions} />
      </Tabs>
    </SafeAreaView>
  );
}
