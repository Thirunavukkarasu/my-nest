import { Flat } from "@/types";
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
import { useUpdateFlat } from "../hooks/useFlatMutations";

interface EditFlatModalProps {
  visible: boolean;
  onClose: () => void;
  flat: Flat | null;
}

export function EditFlatModal({ visible, onClose, flat }: EditFlatModalProps) {
  const updateFlatMutation = useUpdateFlat(flat?.id);
  const [formData, setFormData] = useState({
    flatNumber: "",
    floorNumber: "",
  });

  useEffect(() => {
    if (flat && visible) {
      setFormData({
        flatNumber: flat.flatNumber,
        floorNumber: flat.floor.toString(),
      });
    }
  }, [flat, visible]);

  const handleSave = () => {
    if (!flat || !formData.flatNumber || !formData.floorNumber) {
      return;
    }

    const floorNum = parseInt(formData.floorNumber);
    if (isNaN(floorNum)) {
      return;
    }

    updateFlatMutation.mutate(
      {
        flatId: parseInt(flat.id),
        flatNumber: formData.flatNumber,
        floorNumber: floorNum,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
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
          <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text className="text-2xl font-bold text-gray-900 mb-4">Edit Flat</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Flat Number *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter flat number"
                value={formData.flatNumber}
                onChangeText={(text) => setFormData({ ...formData, flatNumber: text })}
                editable={!updateFlatMutation.isPending}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Floor Number *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter floor number"
                value={formData.floorNumber}
                onChangeText={(text) => setFormData({ ...formData, floorNumber: text })}
                keyboardType="number-pad"
                editable={!updateFlatMutation.isPending}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                disabled={updateFlatMutation.isPending}
              >
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
                disabled={updateFlatMutation.isPending}
              >
                {updateFlatMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
