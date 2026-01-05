/**
 * Resident Profile Screen
 */
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useLogout } from "@/hooks/useLogout";
import { useAuthStore } from "@/store/authStore";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ResidentProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Profile</Text>
          <Text className="text-base text-gray-600">
            Manage your account information
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Personal Information
          </Text>
          <View className="mb-3">
            <Text className="text-sm text-gray-600">Name</Text>
            <Text className="text-base text-gray-900">
              {user?.name || "N/A"}
            </Text>
          </View>
          <View className="mb-3">
            <Text className="text-sm text-gray-600">Email</Text>
            <Text className="text-base text-gray-900">
              {user?.email || "N/A"}
            </Text>
          </View>
          {user?.mobile && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Mobile</Text>
              <Text className="text-base text-gray-900">{user.mobile}</Text>
            </View>
          )}
          <View>
            <Text className="text-sm text-gray-600">Role</Text>
            <Text className="text-base text-gray-900">
              {user?.roleName || "Resident"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => logout()}
          className="bg-red-500 rounded-xl p-4 items-center justify-center mt-4"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <IconSymbol
              name="arrow.right.square.fill"
              size={20}
              color="#FFFFFF"
            />
            <Text className="text-white font-semibold ml-2">Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
