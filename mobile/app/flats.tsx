import { IconSymbol } from "@/components/ui/icon-symbol";
import { adaptFlats } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { Flat } from "@/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FlatsScreen() {
  const router = useRouter();
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newFlat, setNewFlat] = useState({
    floor: "",
    flatNumber: "",
    owner: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    loadFlats();
  }, []);

  const loadFlats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getFlats({
        page: 1,
        limit: 100, // Get all flats for now
        sortCriterias: [],
      });

      if (response.error) {
        console.error("Flats API Error:", response.error);
        Alert.alert("Error", response.error || "Failed to load flats");
        return;
      }

      console.log(
        "Flats API Response:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data?.data) {
        const adaptedFlats = adaptFlats(response.data.data);
        setFlats(adaptedFlats);
      } else {
        console.warn("No data in response:", response.data);
        setFlats([]);
      }
    } catch (error) {
      console.error("Error loading flats:", error);
      Alert.alert(
        "Error",
        "Failed to load flats. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlat = async () => {
    // Validate flat fields
    if (!newFlat.floor || !newFlat.flatNumber) {
      Alert.alert("Error", "Please fill in floor and flat number");
      return;
    }

    // Validate owner fields (name is required)
    if (!newFlat.owner.firstName || !newFlat.owner.lastName) {
      Alert.alert("Error", "Owner first name and last name are required");
      return;
    }

    const floorNum = parseInt(newFlat.floor);
    if (isNaN(floorNum) || floorNum < 0) {
      Alert.alert("Error", "Please enter a valid floor number");
      return;
    }

    try {
      setCreating(true);

      // Prepare request body
      const requestBody = {
        floorNumber: floorNum,
        flatNumber: newFlat.flatNumber,
        owner: {
          firstName: newFlat.owner.firstName.trim(),
          lastName: newFlat.owner.lastName.trim(),
          email: newFlat.owner.email.trim() || undefined,
          phone: newFlat.owner.phone.trim() || undefined,
        },
      };

      const response = await apiClient.createFlat(requestBody);

      if (response.error) {
        Alert.alert("Error", response.error || "Failed to create flat");
        return;
      }

      // Reset form
      setNewFlat({
        floor: "",
        flatNumber: "",
        owner: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
      });
      setShowAddModal(false);

      // Reload flats to show the new one
      await loadFlats();

      Alert.alert("Success", "Flat and owner added successfully");
    } catch (error) {
      console.error("Error creating flat:", error);
      Alert.alert("Error", "Failed to create flat. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Flats</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Add Flat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-gray-600 mt-4">Loading flats...</Text>
          </View>
        ) : (
          <>
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">
                Total: {flats.length} flats | Occupied:{" "}
                {flats.filter((f) => f.isOccupied).length} | Vacant:{" "}
                {flats.filter((f) => !f.isOccupied).length}
              </Text>
            </View>

            {[1, 2, 3, 4, 5].map((floor) => {
              const floorFlats = flats.filter((f) => f.floor === floor);
              return (
                <View key={floor} className="mb-6">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">
                    Floor {floor} ({floorFlats.length} flats)
                  </Text>
                  <View className="flex-row flex-wrap">
                    {floorFlats.map((flat) => (
                      <TouchableOpacity
                        key={flat.id}
                        onPress={() => router.push(`/flats/${flat.id}`)}
                        className={`w-[48%] bg-white rounded-lg p-3 mb-3 mr-2 border ${
                          flat.isOccupied
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <View className="flex-row justify-between items-start mb-2">
                          <Text className="text-lg font-semibold text-gray-900">
                            {flat.flatNumber}
                          </Text>
                          <View
                            className={`px-2 py-1 rounded ${
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
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          if (!creating) {
            setNewFlat({
              floor: "",
              flatNumber: "",
              owner: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
              },
            });
            setShowAddModal(false);
          }
        }}
      >
        <SafeAreaView
          className="flex-1 bg-black/50 justify-end"
          edges={["bottom"]}
        >
          <View className="bg-white rounded-t-3xl p-6 pb-8 max-h-[90%]">
            <ScrollView showsVerticalScrollIndicator={true}>
              <Text className="text-2xl font-bold text-gray-900 mb-4">
                Add New Flat
              </Text>

              <Text className="text-sm text-gray-600 mb-4">
                Flat Information
              </Text>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Floor Number *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter floor number"
                  value={newFlat.floor}
                  onChangeText={(text) =>
                    setNewFlat({ ...newFlat, floor: text })
                  }
                  keyboardType="number-pad"
                  editable={!creating}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Flat Number *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="e.g., 101, 102"
                  value={newFlat.flatNumber}
                  onChangeText={(text) =>
                    setNewFlat({ ...newFlat, flatNumber: text })
                  }
                  editable={!creating}
                />
              </View>

              <View className="border-t border-gray-200 pt-4 mt-2">
                <Text className="text-sm text-gray-600 mb-4">
                  Owner Information (Required)
                </Text>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Owner First Name *
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                    placeholder="Enter owner first name"
                    value={newFlat.owner.firstName}
                    onChangeText={(text) =>
                      setNewFlat({
                        ...newFlat,
                        owner: { ...newFlat.owner, firstName: text },
                      })
                    }
                    editable={!creating}
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Owner Last Name *
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                    placeholder="Enter owner last name"
                    value={newFlat.owner.lastName}
                    onChangeText={(text) =>
                      setNewFlat({
                        ...newFlat,
                        owner: { ...newFlat.owner, lastName: text },
                      })
                    }
                    editable={!creating}
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Owner Email (Optional)
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                    placeholder="Enter owner email"
                    value={newFlat.owner.email}
                    onChangeText={(text) =>
                      setNewFlat({
                        ...newFlat,
                        owner: { ...newFlat.owner, email: text },
                      })
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!creating}
                  />
                </View>

                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Owner Phone (Optional)
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                    placeholder="Enter owner phone"
                    value={newFlat.owner.phone}
                    onChangeText={(text) =>
                      setNewFlat({
                        ...newFlat,
                        owner: { ...newFlat.owner, phone: text },
                      })
                    }
                    keyboardType="phone-pad"
                    editable={!creating}
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    if (!creating) {
                      setNewFlat({
                        floor: "",
                        flatNumber: "",
                        owner: {
                          firstName: "",
                          lastName: "",
                          email: "",
                          phone: "",
                        },
                      });
                      setShowAddModal(false);
                    }
                  }}
                  className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                  disabled={creating}
                >
                  <Text className="text-gray-900 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddFlat}
                  className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
                  disabled={creating}
                >
                  {creating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-semibold">Add Flat</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
