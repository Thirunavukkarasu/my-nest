/**
 * Resident Tabs Layout
 * Navigation for resident users with limited access
 */
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { adaptFlats, adaptResidents } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Flat, Resident } from "@/types";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen name="index" options={homeOptions} />
        <Tabs.Screen name="my-flat" options={myFlatOptions} />
        <Tabs.Screen name="payments" options={paymentsOptions} />
        <Tabs.Screen name="complaints" options={complaintsOptions} />
        <Tabs.Screen name="profile" options={profileOptions} />
      </Tabs>
    </SafeAreaView>
  );
}
