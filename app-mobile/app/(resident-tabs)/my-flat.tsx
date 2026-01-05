/**
 * Resident My Flat Screen
 * Shows details about the resident's own flat
 */
import { IconSymbol } from "@/components/ui/icon-symbol";
import { adaptFlats } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Flat } from "@/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

export default function ResidentMyFlatScreen() {
  const user = useAuthStore((state) => state.user);
  const isImpersonating = useAuthStore((state) => state.isImpersonating);
  const impersonatedFlatId = useAuthStore((state) => state.impersonatedFlatId);
  const [flat, setFlat] = useState<Flat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlatData();
  }, [impersonatedFlatId, isImpersonating]);

  const loadFlatData = async () => {
    if (!isImpersonating || !impersonatedFlatId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.getFlatById(impersonatedFlatId);

      if (response.error) {
        Alert.alert("Error", response.error || "Failed to load flat details");
        setLoading(false);
        return;
      }

      if (response.data?.data) {
        const adaptedFlats = adaptFlats([response.data.data]);
        setFlat(adaptedFlats[0]);
      }
    } catch (error) {
      console.error("Error loading flat data:", error);
      Alert.alert("Error", "Failed to load flat details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">My Flat</Text>
          <Text className="text-base text-gray-600">
            View your flat details and information
          </Text>
        </View>

        {loading ? (
          <View className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-4 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-sm text-gray-600 mt-4">
              Loading flat details...
            </Text>
          </View>
        ) : flat ? (
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-blue-100 rounded-xl items-center justify-center mr-4">
                <IconSymbol name="building.2.fill" size={32} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900">
                  Floor {flat.floor} - Flat {flat.flatNumber}
                </Text>
                <Text className="text-sm text-gray-600">
                  {flat.floor === 0 ? "Ground Floor" : `Floor ${flat.floor}`}
                </Text>
              </View>
            </View>

            <View className="border-t border-gray-200 pt-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-600">Flat Number</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {flat.flatNumber}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-600">Floor</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {flat.floor === 0 ? "Ground Floor" : `Floor ${flat.floor}`}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-600">Status</Text>
                <View
                  className={`px-3 py-1 rounded-full ${
                    flat.isOccupied ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      flat.isOccupied ? "text-green-800" : "text-gray-800"
                    }`}
                  >
                    {flat.isOccupied ? "Occupied" : "Vacant"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              No Flat Selected
            </Text>
            <Text className="text-sm text-gray-600">
              {isImpersonating
                ? "Please select a flat from settings to view details"
                : "No flat information available"}
            </Text>
          </View>
        )}

        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Resident Information
          </Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">Name</Text>
            <Text className="text-base font-semibold text-gray-900">
              {user?.name || "N/A"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">Email</Text>
            <Text className="text-base font-semibold text-gray-900">
              {user?.email || "N/A"}
            </Text>
          </View>
          {user?.mobile && (
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Mobile</Text>
              <Text className="text-base font-semibold text-gray-900">
                {user.mobile}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
