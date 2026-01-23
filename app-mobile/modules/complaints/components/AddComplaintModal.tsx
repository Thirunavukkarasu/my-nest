import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddComplaintModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (complaint: {
    residentId: string;
    flatId: string;
    title: string;
    description: string;
  }) => void;
}

export function AddComplaintModal({ visible, onClose, onSubmit }: AddComplaintModalProps) {
  const impersonatedFlatId = useAuthStore((state) => state.impersonatedFlatId);
  const [formData, setFormData] = useState({
    residentId: "",
    flatId: impersonatedFlatId?.toString() || "",
    title: "",
    description: "",
  });

  useEffect(() => {
    if (visible) {
      setFormData({
        residentId: "",
        flatId: impersonatedFlatId?.toString() || "",
        title: "",
        description: "",
      });
    }
  }, [visible, impersonatedFlatId]);

  const handleSubmit = () => {
    if (!formData.residentId || !formData.flatId || !formData.title || !formData.description) {
      return;
    }

    onSubmit(formData);
    onClose();
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
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text className="text-2xl font-bold text-gray-900 mb-4">Submit Complaint</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Resident ID</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter resident ID"
                value={formData.residentId}
                onChangeText={(text) => setFormData({ ...formData, residentId: text })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Flat ID</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter flat ID"
                value={formData.flatId}
                onChangeText={(text) => setFormData({ ...formData, flatId: text })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Title</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter complaint title"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Describe your complaint"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
              >
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-red-600 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
