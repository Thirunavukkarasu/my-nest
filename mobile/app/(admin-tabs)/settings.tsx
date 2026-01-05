/**
 * Admin Settings Screen
 */
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useLogout } from "@/hooks/useLogout";
import { adaptFlats } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Flat } from "@/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminSettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isImpersonating = useAuthStore((state) => state.isImpersonating);
  const impersonatedFlatId = useAuthStore((state) => state.impersonatedFlatId);
  const toggleImpersonate = useAuthStore((state) => state.toggleImpersonate);
  const setImpersonatedFlatId = useAuthStore(
    (state) => state.setImpersonatedFlatId
  );
  const { logout } = useLogout();

  const [flats, setFlats] = useState<Flat[]>([]);
  const [loadingFlats, setLoadingFlats] = useState(true); // Start with true since we load on mount
  const [showFlatPicker, setShowFlatPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load flats when component mounts
  useEffect(() => {
    // Always load flats when settings page loads (for admin users)
    loadFlats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only load once on mount

  // Reload flats when modal opens if we don't have data
  useEffect(() => {
    if (showFlatPicker && flats.length === 0 && !loadingFlats) {
      loadFlats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFlatPicker]); // Only reload when modal opens, not when flats/loadingFlats change

  // Clear selected flat when impersonation is turned off
  useEffect(() => {
    if (!isImpersonating) {
      setImpersonatedFlatId(null);
    }
  }, [isImpersonating]);

  // Debug: Log flats state changes
  useEffect(() => {
    console.log("Flats state updated:", flats.length, "flats");
    if (flats.length > 0) {
      console.log("First flat:", flats[0]);
    }
  }, [flats]);

  const loadFlats = async () => {
    try {
      setLoadingFlats(true);
      const response = await apiClient.getFlats({
        page: 1,
        limit: 100,
        sortCriterias: [
          { columnName: "floorNumber", columnOrder: "asc" },
          { columnName: "flatNumber", columnOrder: "asc" },
        ],
      });

      if (response.error) {
        console.error("Flats API Error:", response.error);
        setLoadingFlats(false);
        setFlats([]);
        Alert.alert("Error", response.error || "Failed to load flats");
        return;
      }

      if (response.data?.data) {
        const adaptedFlats = adaptFlats(response.data.data);
        console.log("Adapted flats:", adaptedFlats);
        console.log("Setting flats state with", adaptedFlats.length, "flats");
        setFlats(adaptedFlats);
        setLoadingFlats(false);
        console.log("Flats state updated, loadingFlats set to false");
      } else {
        console.log("No data in response, setting empty array");
        setFlats([]);
        setLoadingFlats(false);
      }
    } catch (error) {
      console.error("Error loading flats:", error);
      setLoadingFlats(false);
      setFlats([]);
      Alert.alert(
        "Error",
        "Failed to load flats. Please check your connection."
      );
    }
  };

  const handleToggleImpersonate = () => {
    const newImpersonatingState = !isImpersonating;

    if (newImpersonatingState) {
      // Turning ON: Just enable impersonation mode, don't navigate yet
      // User needs to select a flat first
      toggleImpersonate();
    } else {
      // Turning OFF: Disable impersonation and navigate back to admin view
      toggleImpersonate();
      setImpersonatedFlatId(null); // Clear selected flat
      setTimeout(() => {
        router.replace("/(admin-tabs)" as any);
      }, 100);
    }
  };

  const handleSelectFlat = (flat: Flat) => {
    // Convert string ID to number (API uses number, mobile type uses string)
    const flatId = parseInt(flat.id);
    setImpersonatedFlatId(flatId);
    setShowFlatPicker(false);
    setSearchQuery(""); // Clear search when closing

    // Navigate to resident view only after selecting a flat
    setTimeout(() => {
      router.replace("/(resident-tabs)" as any);
    }, 100);
  };

  const handleCloseModal = () => {
    setShowFlatPicker(false);
    setSearchQuery(""); // Clear search when closing
  };

  const selectedFlat = flats.find((f) => parseInt(f.id) === impersonatedFlatId);

  // Filter flats based on search query
  const filteredFlats = flats.filter((flat) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      flat.flatNumber.toLowerCase().includes(query) ||
      flat.floor.toString().includes(query) ||
      `floor ${flat.floor} flat ${flat.flatNumber}`
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Settings
          </Text>
          <Text className="text-base text-gray-600">
            Manage your account and preferences
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Account Information
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
          <View>
            <Text className="text-sm text-gray-600">Role</Text>
            <Text className="text-base text-gray-900">
              {user?.roleName || "Admin"}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            View Options
          </Text>

          {/* Toggle Switch */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-base font-medium text-gray-900 mb-1">
                View as Resident
              </Text>
              <Text className="text-sm text-gray-600">
                Switch to resident view to see what residents see
              </Text>
            </View>
            <Switch
              value={isImpersonating}
              onValueChange={handleToggleImpersonate}
              trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Flat Selector Dropdown */}
          {isImpersonating && (
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Select Flat (for debugging)
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowFlatPicker(true);
                }}
                className="bg-gray-50 border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
                activeOpacity={0.7}
              >
                <View className="flex-1">
                  {selectedFlat ? (
                    <Text className="text-base text-gray-900">
                      Floor {selectedFlat.floor} - Flat{" "}
                      {selectedFlat.flatNumber}
                    </Text>
                  ) : (
                    <Text className="text-base text-gray-500">
                      Select a flat...
                    </Text>
                  )}
                </View>
                {loadingFlats ? (
                  <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                  <IconSymbol name="chevron.right" size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
              {selectedFlat && (
                <Text className="text-xs text-gray-500 mt-1">
                  Currently viewing as: Floor {selectedFlat.floor} - Flat{" "}
                  {selectedFlat.flatNumber}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Flat Picker Modal */}
        <Modal
          visible={showFlatPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFlatPicker(false)}
        >
          <SafeAreaView
            className="flex-1 bg-black/50 justify-end"
            edges={["bottom"]}
          >
            <View
              className="bg-white rounded-t-3xl"
              style={{ maxHeight: "80%", minHeight: 200 }}
            >
              <View className="px-4 py-3 border-b border-gray-200 flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-900">
                  Select Flat
                </Text>
                <TouchableOpacity onPress={handleCloseModal} className="p-2">
                  <IconSymbol name="xmark" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              {!loadingFlats && flats.length > 0 && (
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: 8,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#f9fafb",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      paddingHorizontal: 12,
                    }}
                  >
                    <IconSymbol
                      name="magnifyingglass"
                      size={20}
                      color="#6b7280"
                    />
                    <TextInput
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 8,
                        fontSize: 16,
                        color: "#111827",
                      }}
                      placeholder="Search by floor or flat number..."
                      placeholderTextColor="#9ca3af"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setSearchQuery("")}
                        style={{ padding: 4 }}
                      >
                        <IconSymbol
                          name="xmark.circle.fill"
                          size={20}
                          color="#9ca3af"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {loadingFlats ? (
                <View
                  style={{
                    paddingVertical: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 200,
                  }}
                >
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      marginTop: 16,
                    }}
                  >
                    Loading flats...
                  </Text>
                </View>
              ) : flats.length === 0 ? (
                <View
                  style={{
                    paddingVertical: 32,
                    paddingHorizontal: 16,
                    alignItems: "center",
                    minHeight: 200,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      marginBottom: 16,
                    }}
                  >
                    No flats available
                  </Text>
                  <TouchableOpacity
                    onPress={loadFlats}
                    style={{
                      backgroundColor: "#2563eb",
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: "#ffffff", fontWeight: "600" }}>
                      Retry Loading
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : filteredFlats.length === 0 ? (
                <View
                  style={{
                    paddingVertical: 32,
                    paddingHorizontal: 16,
                    alignItems: "center",
                    minHeight: 200,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      marginBottom: 16,
                    }}
                  >
                    No flats found matching "{searchQuery}"
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    style={{
                      backgroundColor: "#2563eb",
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: "#ffffff", fontWeight: "600" }}>
                      Clear Search
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#6b7280",
                      }}
                    >
                      {filteredFlats.length} of {flats.length} flat
                      {flats.length !== 1 ? "s" : ""} shown
                    </Text>
                  </View>
                  <FlatList
                    data={filteredFlats}
                    keyExtractor={(item) => item.id}
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                      paddingHorizontal: 16,
                      paddingBottom: 20,
                    }}
                    renderItem={({ item: flat }) => {
                      const isSelected =
                        parseInt(flat.id) === impersonatedFlatId;
                      return (
                        <TouchableOpacity
                          onPress={() => handleSelectFlat(flat)}
                          style={{
                            padding: 16,
                            marginBottom: 8,
                            borderRadius: 8,
                            borderWidth: 1,
                            backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                            borderColor: isSelected ? "#3b82f6" : "#e5e7eb",
                          }}
                          activeOpacity={0.7}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "500",
                                  color: "#111827",
                                }}
                              >
                                Floor {flat.floor} - Flat {flat.flatNumber}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "#6b7280",
                                  marginTop: 4,
                                }}
                              >
                                {flat.isOccupied ? "Occupied" : "Vacant"}
                              </Text>
                            </View>
                            {isSelected && (
                              <IconSymbol
                                name="checkmark.circle.fill"
                                size={24}
                                color="#3b82f6"
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    showsVerticalScrollIndicator={true}
                  />
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal>

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
    </SafeAreaView>
  );
}
