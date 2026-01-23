import { IconSymbol } from "@/components/ui/icon-symbol";
import { AddResidentModal } from "@/modules/residents/components/AddResidentModal";
import { useResidentsQuery } from "@/modules/residents/hooks/useResidentsQuery";
import { Resident } from "@/types";
import {
  LegendList,
  LegendListRenderItemProps,
} from "@legendapp/list";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ResidentsScreen() {
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch residents using React Query
  const {
    data: residents = [],
    isLoading: loading,
    error,
  } = useResidentsQuery();

  const getAgeCategoryLabel = (category?: string) => {
    switch (category) {
      case "kid":
        return "👶 Kid";
      case "adult":
        return "👤 Adult";
      case "senior_citizen":
        return "👴 Senior";
      default:
        return "";
    }
  };

  const getRelationLabel = (relation?: string) => {
    switch (relation) {
      case "self":
        return "Self";
      case "spouse":
        return "Spouse";
      case "child":
        return "Child";
      case "parent":
        return "Parent";
      case "sibling":
        return "Sibling";
      case "other":
        return "Other";
      default:
        return "";
    }
  };

  const stats = {
    total: residents.length,
    owners: residents.filter((r) => r.type === "owner").length,
    tenants: residents.filter((r) => r.type === "tenant").length,
    kids: residents.filter((r) => r.ageCategory === "kid").length,
    adults: residents.filter((r) => r.ageCategory === "adult").length,
    seniors: residents.filter((r) => r.ageCategory === "senior_citizen").length,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Residents</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Add Resident</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-gray-600 mt-4">Loading residents...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center py-20 px-4">
          <Text className="text-red-600 text-center">
            Error loading residents: {error instanceof Error ? error.message : "Unknown error"}
          </Text>
        </View>
      ) : (
        <LegendList
          data={residents}
          renderItem={({ item: resident }: LegendListRenderItemProps<Resident>) => (
            <View className="px-4 mb-3">
              <View className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {resident.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Flat: {resident.flatId}
                    </Text>
                    {resident.relation && (
                      <Text className="text-xs text-gray-500 mt-1">
                        Relation: {getRelationLabel(resident.relation)}
                      </Text>
                    )}
                  </View>
                  <View className="items-end gap-1">
                    <View
                      className={`px-3 py-1 rounded ${
                        resident.type === "owner" ? "bg-green-100" : "bg-blue-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          resident.type === "owner"
                            ? "text-green-700"
                            : "text-blue-700"
                        }`}
                      >
                        {resident.type === "owner" ? "Owner" : "Tenant"}
                      </Text>
                    </View>
                    {resident.ageCategory && (
                      <View className="px-3 py-1 rounded bg-purple-100 mt-1">
                        <Text className="text-xs font-medium text-purple-700">
                          {getAgeCategoryLabel(resident.ageCategory)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text className="text-sm text-gray-600 mb-1">
                  📞 {resident.phone}
                </Text>
                {resident.email && (
                  <Text className="text-sm text-gray-600">
                    ✉️ {resident.email}
                  </Text>
                )}
              </View>
            </View>
          )}
          keyExtractor={(resident) => resident.id}
          ListHeaderComponent={
            <View className="px-4 pt-4 pb-2">
              <View className="flex-row gap-2 mb-2 flex-wrap">
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">Total</Text>
                  <Text className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">Owners</Text>
                  <Text className="text-2xl font-bold text-green-600">
                    {stats.owners}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">Tenants</Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    {stats.tenants}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-2 flex-wrap">
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">Kids</Text>
                  <Text className="text-2xl font-bold text-purple-600">
                    {stats.kids}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">Adults</Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    {stats.adults}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">Seniors</Text>
                  <Text className="text-2xl font-bold text-orange-600">
                    {stats.seniors}
                  </Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="px-4 py-20 items-center">
              <Text className="text-gray-500 text-lg">No residents found</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          recycleItems={true}
          maintainVisibleContentPosition
        />
      )}

      <AddResidentModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </SafeAreaView>
  );
}
