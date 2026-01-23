import { IconSymbol } from "@/components/ui/icon-symbol";
import { FlatWithOwner, useFlatsQuery } from "@/modules/flats/hooks/useFlatsQuery";
import {
  LegendList,
  LegendListRenderItemProps,
} from "@legendapp/list";
import * as ExpoRouter from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function FlatsScreen() {
  const router = (ExpoRouter as any).useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch flats using React Query
  const {
    data: flats = [],
    isLoading: loading,
    error,
  } = useFlatsQuery();

  // Memoize filtered and grouped flats data
  const listData = useMemo(() => {
    // Filter flats based on search query
    let filteredFlats = flats;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredFlats = flats.filter((flat: FlatWithOwner) => {
        const matchesFlatNumber = flat.flatNumber
          .toLowerCase()
          .includes(query);
        const matchesFloor = flat.floor.toString().includes(query);
        const matchesOwner = flat.owner?.name
          .toLowerCase()
          .includes(query);
        return matchesFlatNumber || matchesFloor || matchesOwner;
      });
    }

    // Group by floor and flatten
    // Get unique floors from filtered flats and sort them
    const uniqueFloors = Array.from(
      new Set(filteredFlats.map((f: FlatWithOwner) => f.floor))
    ).sort((a, b) => a - b);

    const items: Array<
      | { type: "floor"; floor: number; count: number }
      | { type: "flat"; flat: FlatWithOwner }
    > = [];
    
    uniqueFloors.forEach((floor) => {
      const floorFlats = filteredFlats.filter((f: FlatWithOwner) => f.floor === floor);
      if (floorFlats.length > 0) {
        items.push({
          type: "floor",
          floor,
          count: floorFlats.length,
        });
        floorFlats.forEach((flat: FlatWithOwner) => {
          items.push({ type: "flat", flat });
        });
      }
    });
    return items;
  }, [flats, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Flats</Text>
          <TouchableOpacity
            onPress={() => router.push("/flats/add")}
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Add Flat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View className="px-4 py-2 bg-red-50 border-b border-red-200">
          <Text className="text-red-700 text-sm">
            {(error as Error).message || "Failed to load flats"}
          </Text>
        </View>
      )}

      {loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-600 mt-4">Loading flats...</Text>
        </View>
      ) : (
        <>
          {/* Search Bar */}
          <View className="px-4 py-3 bg-white border-b border-gray-200">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
              <Text className="text-gray-400 mr-2">🔍</Text>
              <TextInput
                className="flex-1 text-base text-gray-900"
                placeholder="Search by flat number, floor, or owner name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <IconSymbol name="xmark.circle.fill" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <LegendList
            data={listData}
            renderItem={({
              item,
            }: LegendListRenderItemProps<
              | { type: "floor"; floor: number; count: number }
              | { type: "flat"; flat: FlatWithOwner }
            >) => {
              if (item.type === "floor") {
                return (
                  <View className="px-4 pt-6 pb-3 bg-gray-50">
                    <Text className="text-lg font-semibold text-gray-900">
                      Floor {item.floor} ({item.count} flats)
                    </Text>
                  </View>
                );
              }
              const { flat } = item;
              return (
                <TouchableOpacity
                  onPress={() => router.push(`/(admin-tabs)/flats/${flat.id}`)}
                  className="px-4 py-3 bg-white border-b border-gray-100"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-lg font-semibold text-gray-900 mr-2">
                          {flat.flatNumber}
                        </Text>
                        <View
                          className={`px-2 py-0.5 rounded ${
                            flat.isOccupied ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              flat.isOccupied
                                ? "text-green-700"
                                : "text-gray-600"
                            }`}
                          >
                            {flat.isOccupied ? "Occupied" : "Vacant"}
                          </Text>
                        </View>
                      </View>
                      {flat.owner && (
                        <View className="mt-2">
                          <Text className="text-sm font-medium text-gray-700 mb-1">
                            Owner: {flat.owner.name}
                          </Text>
                          {flat.owner.phone && (
                            <Text className="text-xs text-gray-600">
                              📞 {flat.owner.phone}
                            </Text>
                          )}
                          {flat.owner.email && (
                            <Text className="text-xs text-gray-600">
                              ✉️ {flat.owner.email}
                            </Text>
                          )}
                        </View>
                      )}
                      {!flat.owner && flat.isOccupied && (
                        <Text className="text-xs text-gray-500 mt-1">
                          Owner details not available
                        </Text>
                      )}
                    </View>
                    <IconSymbol
                      name="chevron.right"
                      size={20}
                      color="#9CA3AF"
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(
              item:
                | { type: "floor"; floor: number; count: number }
                | { type: "flat"; flat: FlatWithOwner },
              index: number
            ) => {
              if (item.type === "floor") {
                return `floor-${item.floor}`;
              }
              return `flat-${item.flat.id}`;
            }}
            ListHeaderComponent={
              <View className="px-4 pt-4 pb-2 bg-gray-50">
                <Text className="text-sm text-gray-600">
                  Total: {flats.length} flats | Occupied:{" "}
                  {flats.filter((f: FlatWithOwner) => f.isOccupied).length} | Vacant:{" "}
                  {flats.filter((f: FlatWithOwner) => !f.isOccupied).length}
                  {searchQuery.trim() && (
                    <Text className="font-semibold">
                      {" "}
                      | Showing:{" "}
                      {
                        flats.filter((f: FlatWithOwner) => {
                          const query = searchQuery.toLowerCase().trim();
                          return (
                            f.flatNumber.toLowerCase().includes(query) ||
                            f.floor.toString().includes(query) ||
                            f.owner?.name.toLowerCase().includes(query)
                          );
                        }).length
                      }{" "}
                      results
                    </Text>
                  )}
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View className="px-4 py-20 items-center">
                <IconSymbol name="building.2.fill" size={48} color="#D1D5DB" />
                <Text className="text-gray-500 text-center mt-4">
                  {searchQuery.trim()
                    ? "No flats found matching your search"
                    : "No flats available"}
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
            recycleItems={true}
            maintainVisibleContentPosition
          />
        </>
      )}

    </SafeAreaView>
  );
}
