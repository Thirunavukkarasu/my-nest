import { FuelType, VehicleType } from "@/types";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateVehicle } from "../hooks/useVehicleMutations";

interface AddVehicleModalProps {
  visible: boolean;
  onClose: () => void;
  flatId?: string; // Optional - if not provided, user can enter it
  residentId?: string;
}

const getVehicleTypeIcon = (type: VehicleType) => {
  switch (type) {
    case "car": return "🚗";
    case "bike": return "🏍️";
    case "scooty": return "🛵";
    case "bicycle": return "🚲";
  }
};

const getFuelTypeLabel = (fuelType?: FuelType) => {
  switch (fuelType) {
    case "petrol": return "⛽ Petrol";
    case "diesel": return "🛢️ Diesel";
    case "electric": return "🔌 Electric";
    case "none": return "🚫 None";
    default: return "";
  }
};

export function AddVehicleModal({ visible, onClose, flatId, residentId }: AddVehicleModalProps) {
  const createVehicleMutation = useCreateVehicle(flatId);
  const [formData, setFormData] = useState({
    flatId: flatId || "",
    residentId: residentId || "",
    vehicleType: "car" as VehicleType,
    fuelType: "petrol" as FuelType,
    registrationNumber: "",
    make: "",
    model: "",
    color: "",
  });

  useEffect(() => {
    if (visible) {
      setFormData({
        flatId: flatId || "",
        residentId: residentId || "",
        vehicleType: "car",
        fuelType: "petrol",
        registrationNumber: "",
        make: "",
        model: "",
        color: "",
      });
    }
  }, [visible, flatId, residentId]);

  const handleSubmit = () => {
    const finalFlatId = flatId || formData.flatId;
    if (!finalFlatId) {
      return;
    }

    const flatIdNum = parseInt(finalFlatId);
    if (isNaN(flatIdNum)) {
      return;
    }

    const vehicleData: any = {
      flatId: flatIdNum,
      vehicleType: formData.vehicleType,
      fuelType: formData.fuelType,
    };

    if (formData.residentId) {
      const residentIdNum = parseInt(formData.residentId);
      if (!isNaN(residentIdNum)) {
        vehicleData.residentId = residentIdNum;
      }
    }

    if (formData.registrationNumber) vehicleData.registrationNumber = formData.registrationNumber;
    if (formData.make) vehicleData.make = formData.make;
    if (formData.model) vehicleData.model = formData.model;
    if (formData.color) vehicleData.color = formData.color;

    createVehicleMutation.mutate(vehicleData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black/50 justify-end" edges={["bottom"]}>
        <TouchableOpacity 
          className="absolute inset-0" 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View className="bg-white rounded-t-3xl p-6 pb-8 max-h-[90%]">
          <KeyboardAwareScrollView 
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-2xl font-bold text-gray-900 mb-4">Add New Vehicle</Text>

            {!flatId && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Flat ID *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter flat ID"
                  value={formData.flatId}
                  onChangeText={(text) => setFormData({ ...formData, flatId: text })}
                  keyboardType="number-pad"
                  editable={!createVehicleMutation.isPending}
                />
              </View>
            )}

            {!residentId && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Resident ID (Optional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter resident ID (optional)"
                  value={formData.residentId}
                  onChangeText={(text) => setFormData({ ...formData, residentId: text })}
                  keyboardType="number-pad"
                  editable={!createVehicleMutation.isPending}
                />
              </View>
            )}

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Vehicle Type *</Text>
              <View className="flex-row gap-2 flex-wrap">
                {(["car", "bike", "scooty", "bicycle"] as VehicleType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setFormData({ ...formData, vehicleType: type })}
                    className={`px-4 py-2 rounded-lg border-2 ${
                      formData.vehicleType === type
                        ? "bg-green-50 border-green-500"
                        : "bg-gray-50 border-gray-300"
                    }`}
                    disabled={createVehicleMutation.isPending}
                  >
                    <Text
                      className={`text-sm font-medium capitalize ${
                        formData.vehicleType === type ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {getVehicleTypeIcon(type)} {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Fuel Type</Text>
              <View className="flex-row gap-2 flex-wrap">
                {(["petrol", "diesel", "electric", "none"] as FuelType[]).map((fuel) => (
                  <TouchableOpacity
                    key={fuel}
                    onPress={() => setFormData({ ...formData, fuelType: fuel })}
                    className={`px-3 py-2 rounded-lg border-2 ${
                      formData.fuelType === fuel
                        ? "bg-blue-50 border-blue-500"
                        : "bg-gray-50 border-gray-300"
                    }`}
                    disabled={createVehicleMutation.isPending}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        formData.fuelType === fuel ? "text-blue-700" : "text-gray-600"
                      }`}
                    >
                      {getFuelTypeLabel(fuel)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Registration Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter registration number (optional)"
                value={formData.registrationNumber}
                onChangeText={(text) => setFormData({ ...formData, registrationNumber: text })}
                autoCapitalize="characters"
                editable={!createVehicleMutation.isPending}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Make</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="e.g., Honda, Toyota (optional)"
                value={formData.make}
                onChangeText={(text) => setFormData({ ...formData, make: text })}
                editable={!createVehicleMutation.isPending}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Model</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="e.g., Civic, Activa (optional)"
                value={formData.model}
                onChangeText={(text) => setFormData({ ...formData, model: text })}
                editable={!createVehicleMutation.isPending}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Color</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter color (optional)"
                value={formData.color}
                onChangeText={(text) => setFormData({ ...formData, color: text })}
                editable={!createVehicleMutation.isPending}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                disabled={createVehicleMutation.isPending}
              >
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-green-600 rounded-lg py-3 items-center"
                disabled={createVehicleMutation.isPending}
              >
                {createVehicleMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold">Add Vehicle</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
