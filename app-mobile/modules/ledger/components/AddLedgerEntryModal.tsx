import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddLedgerEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLedgerEntryModal({ visible, onClose, onSuccess }: AddLedgerEntryModalProps) {
  const impersonatedFlatId = useAuthStore((state) => state.impersonatedFlatId);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    flatId: impersonatedFlatId?.toString() || "",
    residentId: "",
    entryType: "credit" as "credit" | "debit",
    amount: "",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (visible) {
      setFormData({
        flatId: impersonatedFlatId?.toString() || "",
        residentId: "",
        entryType: "credit",
        amount: "",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [visible, impersonatedFlatId]);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.description || !formData.transactionDate) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const entryData = {
        flatId: formData.flatId ? parseInt(formData.flatId) : null,
        residentId: formData.residentId ? parseInt(formData.residentId) : null,
        entryType: formData.entryType,
        amount: parseFloat(formData.amount),
        description: formData.description,
        transactionDate: formData.transactionDate,
      };

      const response = await apiClient.createLedgerEntry(entryData);

      if (response.error) {
        Alert.alert("Error", response.error);
        return;
      }

      Alert.alert("Success", "Ledger entry added successfully");
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to add ledger entry");
      console.error("Error adding ledger entry:", error);
    } finally {
      setLoading(false);
    }
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
            <Text className="text-2xl font-bold text-gray-900 mb-4">Add Ledger Entry</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Entry Type *</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, entryType: "credit" })}
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    formData.entryType === "credit"
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <Text
                    className={`font-semibold ${
                      formData.entryType === "credit" ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    Credit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, entryType: "debit" })}
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    formData.entryType === "debit"
                      ? "bg-red-50 border-red-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <Text
                    className={`font-semibold ${
                      formData.entryType === "debit" ? "text-red-700" : "text-gray-600"
                    }`}
                  >
                    Debit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Flat ID</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter flat ID (optional)"
                value={formData.flatId}
                onChangeText={(text) => setFormData({ ...formData, flatId: text })}
                keyboardType="number-pad"
                editable={!loading}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Resident ID</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter resident ID (optional)"
                value={formData.residentId}
                onChangeText={(text) => setFormData({ ...formData, residentId: text })}
                keyboardType="number-pad"
                editable={!loading}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Amount *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter amount"
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Description *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                editable={!loading}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Transaction Date *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="YYYY-MM-DD"
                value={formData.transactionDate}
                onChangeText={(text) => setFormData({ ...formData, transactionDate: text })}
                editable={!loading}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                disabled={loading}
              >
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold">Add Entry</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
