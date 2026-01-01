import { ScrollView, Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Explore</Text>
          <Text className="text-base text-gray-600">
            RR Enclave Apartment Management System
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            About
          </Text>
          <Text className="text-sm text-gray-600">
            This is the apartment management system for RR Enclave, managing 40
            flats across 5 floors.
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Features
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            • Manage flats and residents{"\n"}• Track payments and payouts{"\n"}
            • Handle maintenance requests{"\n"}• Manage complaints{"\n"}• Post
            notices
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
