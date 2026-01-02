/**
 * Resident Home Screen
 * Overview for resident users showing their flat and payment information
 */
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface QuickActionProps {
  title: string;
  icon: string;
  onPress: () => void;
  color: string;
}

function QuickAction({ title, icon, onPress, color }: QuickActionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200 flex-1 mx-2"
      activeOpacity={0.7}
    >
      <View className="items-center">
        <View
          className={`w-12 h-12 rounded-lg ${color} items-center justify-center mb-2`}
        >
          <IconSymbol name={icon as any} size={24} color="#FFFFFF" />
        </View>
        <Text className="text-sm font-semibold text-gray-900 text-center">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ResidentHomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </Text>
          <Text className="text-base text-gray-600">
            {user?.name || "Resident"}
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="mb-6">
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              My Flat
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">Flat Number</Text>
              <Text className="text-base font-semibold text-gray-900">-</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">Monthly Maintenance</Text>
              <Text className="text-base font-semibold text-gray-900">
                ₹2,500
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Status</Text>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-green-800">
                  Current
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Payment Status
            </Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">This Month</Text>
              <Text className="text-base font-semibold text-green-600">
                Paid
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Outstanding</Text>
              <Text className="text-base font-semibold text-gray-900">₹0</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-2">
          <Text className="text-xl font-semibold text-gray-900 mb-3">
            Quick Actions
          </Text>
        </View>

        <View className="flex-row mb-4">
          <QuickAction
            title="My Flat"
            icon="building.2.fill"
            color="bg-blue-500"
            onPress={() => router.push("/(resident-tabs)/my-flat" as any)}
          />
          <QuickAction
            title="Payments"
            icon="creditcard.fill"
            color="bg-green-500"
            onPress={() => router.push("/(resident-tabs)/payments" as any)}
          />
        </View>

        <View className="flex-row">
          <QuickAction
            title="Complaints"
            icon="exclamationmark.triangle.fill"
            color="bg-red-500"
            onPress={() => router.push("/(resident-tabs)/complaints" as any)}
          />
          <QuickAction
            title="Profile"
            icon="person.fill"
            color="bg-purple-500"
            onPress={() => router.push("/(resident-tabs)/profile" as any)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
