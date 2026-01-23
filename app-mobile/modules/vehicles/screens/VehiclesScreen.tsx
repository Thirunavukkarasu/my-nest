import { IconSymbol } from "@/components/ui/icon-symbol";
import { useVehiclesQuery } from "@/modules/vehicles/hooks/useVehiclesQuery";
import { Vehicle } from "@/types";
import {
  LegendList,
  LegendListRenderItemProps,
} from "@legendapp/list";
import * as ExpoRouter from "expo-router";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function VehiclesScreen() {
  const router = (ExpoRouter as any).useRouter();

  // Fetch vehicles using React Query
  const {
    data: vehicles = [],
    isLoading: loading,
    error,
  } = useVehiclesQuery();

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "car":
        return "🚗";
      case "bike":
        return "🏍️";
      case "scooty":
        return "🛵";
      case "bicycle":
        return "🚲";
      default:
        return "🚙";
    }
  };

  const getFuelTypeLabel = (fuelType?: string) => {
    switch (fuelType) {
      case "petrol":
        return "⛽ Petrol";
      case "diesel":
        return "🛢️ Diesel";
      case "electric":
        return "🔌 Electric";
      case "none":
        return "🚫 None";
      default:
        return "";
    }
  };

  const stats = {
    total: vehicles.length,
    cars: vehicles.filter((v) => v.vehicleType === "car").length,
    bikes: vehicles.filter((v) => v.vehicleType === "bike").length,
    scooties: vehicles.filter((v) => v.vehicleType === "scooty").length,
    bicycles: vehicles.filter((v) => v.vehicleType === "bicycle").length,
    electric: vehicles.filter((v) => v.fuelType === "electric").length,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Vehicles</Text>
          <TouchableOpacity
            onPress={() => router.push("/vehicles/add")}
            className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Add Vehicle</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-gray-600 mt-4">Loading vehicles...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center py-20 px-4">
          <Text className="text-red-600 text-center">
            Error loading vehicles: {error instanceof Error ? error.message : "Unknown error"}
          </Text>
        </View>
      ) : (
        <LegendList
          data={vehicles.filter((v) => v.status === "active")}
          renderItem={({ item: vehicle }: LegendListRenderItemProps<Vehicle>) => (
            <View className="px-4 mb-3">
              <View className="bg-white rounded-lg p-4 border border-gray-200">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-2xl">{getVehicleTypeIcon(vehicle.vehicleType)}</Text>
                      <Text className="text-lg font-semibold text-gray-900 capitalize">
                        {vehicle.vehicleType}
                      </Text>
                    </View>
                    {vehicle.make && vehicle.model && (
                      <Text className="text-sm text-gray-600">
                        {vehicle.make} {vehicle.model}
                      </Text>
                    )}
                    <Text className="text-sm text-gray-600">
                      Flat: {vehicle.flatId}
                    </Text>
                  </View>
                  {vehicle.fuelType && (
                    <View className="px-3 py-1 rounded bg-blue-100">
                      <Text className="text-xs font-medium text-blue-700">
                        {getFuelTypeLabel(vehicle.fuelType)}
                      </Text>
                    </View>
                  )}
                </View>
                {vehicle.registrationNumber && (
                  <Text className="text-sm text-gray-600 mb-1">
                    🏷️ {vehicle.registrationNumber}
                  </Text>
                )}
                {vehicle.color && (
                  <Text className="text-sm text-gray-600">
                    🎨 {vehicle.color}
                  </Text>
                )}
              </View>
            </View>
          )}
          keyExtractor={(vehicle) => vehicle.id}
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
                  <Text className="text-sm text-gray-600">🚗 Cars</Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    {stats.cars}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">🏍️ Bikes</Text>
                  <Text className="text-2xl font-bold text-orange-600">
                    {stats.bikes}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-2 flex-wrap">
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">🛵 Scooties</Text>
                  <Text className="text-2xl font-bold text-green-600">
                    {stats.scooties}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">🚲 Bicycles</Text>
                  <Text className="text-2xl font-bold text-purple-600">
                    {stats.bicycles}
                  </Text>
                </View>
                <View className="flex-1 bg-white rounded-lg p-3 min-w-[30%]">
                  <Text className="text-sm text-gray-600">🔌 Electric</Text>
                  <Text className="text-2xl font-bold text-teal-600">
                    {stats.electric}
                  </Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="px-4 py-20 items-center">
              <Text className="text-gray-500 text-lg">No vehicles found</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          recycleItems={true}
          maintainVisibleContentPosition
        />
      )}

    </SafeAreaView>
  );
}
