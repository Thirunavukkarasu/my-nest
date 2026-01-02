/**
 * Resident My Flat Screen
 * Shows details about the resident's own flat
 */
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuthStore } from "@/store/authStore";
import { ScrollView, Text, View } from "react-native";

export default function ResidentMyFlatScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">My Flat</Text>
          <Text className="text-base text-gray-600">
            View your flat details and information
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-blue-100 rounded-xl items-center justify-center mr-4">
              <IconSymbol name="building.2.fill" size={32} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                Flat G001
              </Text>
              <Text className="text-sm text-gray-600">Ground Floor</Text>
            </View>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-600">Flat Number</Text>
              <Text className="text-base font-semibold text-gray-900">
                G001
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-600">Floor</Text>
              <Text className="text-base font-semibold text-gray-900">
                Ground Floor
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-600">Status</Text>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-green-800">
                  Occupied
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Monthly Maintenance</Text>
              <Text className="text-base font-semibold text-gray-900">
                ₹2,500
              </Text>
            </View>
          </View>
        </View>

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
