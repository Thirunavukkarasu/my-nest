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
import { useCreateFlat } from "../hooks/useFlatMutations";

interface AddFlatModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddFlatModal({ visible, onClose }: AddFlatModalProps) {
  const createFlatMutation = useCreateFlat();
  const [formData, setFormData] = useState({
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
    if (visible) {
      setFormData({
        floor: "",
        flatNumber: "",
        owner: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        },
      });
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!formData.floor || !formData.flatNumber || !formData.owner.firstName || !formData.owner.lastName) {
      return;
    }

    const floorNum = parseInt(formData.floor);
    if (isNaN(floorNum)) {
      return;
    }

    createFlatMutation.mutate(
      {
        floorNumber: floorNum,
        flatNumber: formData.flatNumber,
        owner: {
          firstName: formData.owner.firstName,
          lastName: formData.owner.lastName,
          email: formData.owner.email || undefined,
          phone: formData.owner.phone || undefined,
        },
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
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text className="text-2xl font-bold text-gray-900 mb-4">Add New Flat</Text>

            <Text className="text-sm text-gray-600 mb-4">Flat Information</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Floor Number *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter floor number"
                value={formData.floor}
                onChangeText={(text) => setFormData({ ...formData, floor: text })}
                keyboardType="number-pad"
                editable={!createFlatMutation.isPending}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Flat Number *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="e.g., 101, 102"
                value={formData.flatNumber}
                onChangeText={(text) => setFormData({ ...formData, flatNumber: text })}
                editable={!createFlatMutation.isPending}
              />
            </View>

            <View className="border-t border-gray-200 pt-4 mt-2">
              <Text className="text-sm text-gray-600 mb-4">Owner Information (Required)</Text>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Owner First Name *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter owner first name"
                  value={formData.owner.firstName}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      owner: { ...formData.owner, firstName: text },
                    })
                  }
                  editable={!createFlatMutation.isPending}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Owner Last Name *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter owner last name"
                  value={formData.owner.lastName}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      owner: { ...formData.owner, lastName: text },
                    })
                  }
                  editable={!createFlatMutation.isPending}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Owner Email (Optional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter owner email"
                  value={formData.owner.email}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      owner: { ...formData.owner, email: text },
                    })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!createFlatMutation.isPending}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Owner Phone (Optional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                  placeholder="Enter owner phone"
                  value={formData.owner.phone}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      owner: { ...formData.owner, phone: text },
                    })
                  }
                  keyboardType="phone-pad"
                  editable={!createFlatMutation.isPending}
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                disabled={createFlatMutation.isPending}
              >
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
                disabled={createFlatMutation.isPending}
              >
                {createFlatMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold">Add Flat</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
