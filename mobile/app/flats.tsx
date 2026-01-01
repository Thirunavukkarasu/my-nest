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

export default function FlatsScreen() {
  const router = useRouter();
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFlat, setNewFlat] = useState({ floor: "", flatNumber: "" });

  useEffect(() => {
    loadFlats();
  }, []);

  const loadFlats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getFlats({
        page: 1,
        limit: 100, // Get all flats for now
        sortCriterias: [{ columnName: "floorNumber", columnOrder: "asc" }],
      });

      if (response.error) {
        Alert.alert("Error", response.error);
        return;
      }

      if (response.data?.data) {
        const adaptedFlats = adaptFlats(response.data.data);
        setFlats(adaptedFlats);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load flats");
      console.error("Error loading flats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlat = () => {
    if (!newFlat.floor || !newFlat.flatNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const floorNum = parseInt(newFlat.floor);
    if (floorNum < 1 || floorNum > 5) {
      Alert.alert("Error", "Floor must be between 1 and 5");
      return;
    }

    const flat: Flat = {
      id: Date.now().toString(),
      floor: floorNum,
      flatNumber: newFlat.flatNumber,
      isOccupied: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFlats([...flats, flat]);
    setNewFlat({ floor: "", flatNumber: "" });
    setShowAddModal(false);
    Alert.alert("Success", "Flat added successfully");
  };

  return (
    <View className="flex-1 bg-gray-50">
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
                      <View
                        key={flat.id}
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
                      </View>
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
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Add New Flat
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Floor (1-5)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter floor number"
                value={newFlat.floor}
                onChangeText={(text) => setNewFlat({ ...newFlat, floor: text })}
                keyboardType="number-pad"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Flat Number
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="e.g., 101, 102"
                value={newFlat.flatNumber}
                onChangeText={(text) =>
                  setNewFlat({ ...newFlat, flatNumber: text })
                }
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
              >
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddFlat}
                className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Add Flat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
