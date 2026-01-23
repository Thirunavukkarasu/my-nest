import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreatePayment } from "../hooks/usePaymentMutations";
import { Resident } from "@/types";

interface AddPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  flatId: string;
  residents: Resident[];
}

export function AddPaymentModal({ visible, onClose, flatId, residents }: AddPaymentModalProps) {
  const createPaymentMutation = useCreatePayment(flatId);
  const [formData, setFormData] = useState({
    residentId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentType: "maintenance" as "maintenance" | "payout",
    paymentMethod: "",
    referenceNumber: "",
  });

  useEffect(() => {
    if (visible) {
      setFormData({
        residentId: "",
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentType: "maintenance",
        paymentMethod: "",
        referenceNumber: "",
      });
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!formData.residentId || !formData.amount || !formData.paymentDate) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    createPaymentMutation.mutate(
      {
        ...formData,
        flatId,
        amount: amount.toString(),
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
            <Text className="text-2xl font-bold text-gray-900 mb-4">Record Payment</Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Resident *</Text>
              <View className="border border-gray-300 rounded-lg bg-white">
                {residents.length === 0 ? (
                  <Text className="px-4 py-3 text-gray-500">No residents available</Text>
                ) : (
                  <ScrollView className="max-h-32">
                    {residents.map((resident) => (
                      <TouchableOpacity
                        key={resident.id}
                        onPress={() => setFormData({ ...formData, residentId: resident.id })}
                        className={`px-4 py-3 border-b border-gray-100 ${
                          formData.residentId === resident.id ? "bg-blue-50" : ""
                        }`}
                        disabled={createPaymentMutation.isPending}
                      >
                        <Text className="font-medium text-gray-900">{resident.name}</Text>
                        <Text className="text-sm text-gray-600">{resident.phone}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Payment Type *</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, paymentType: "maintenance" })}
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    formData.paymentType === "maintenance"
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  disabled={createPaymentMutation.isPending}
                >
                  <Text
                    className={`font-semibold ${
                      formData.paymentType === "maintenance" ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    Maintenance
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, paymentType: "payout" })}
                  className={`flex-1 rounded-lg py-3 items-center border-2 ${
                    formData.paymentType === "payout"
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  disabled={createPaymentMutation.isPending}
                >
                  <Text
                    className={`font-semibold ${
                      formData.paymentType === "payout" ? "text-blue-700" : "text-gray-600"
                    }`}
                  >
                    Payout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Amount *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter amount"
                value={formData.amount}
                onChangeText={(text) => setFormData({ ...formData, amount: text })}
                keyboardType="decimal-pad"
                editable={!createPaymentMutation.isPending}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Payment Date *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="YYYY-MM-DD"
                value={formData.paymentDate}
                onChangeText={(text) => setFormData({ ...formData, paymentDate: text })}
                editable={!createPaymentMutation.isPending}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Payment Method</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="e.g., UPI, Cash, Bank Transfer (optional)"
                value={formData.paymentMethod}
                onChangeText={(text) => setFormData({ ...formData, paymentMethod: text })}
                editable={!createPaymentMutation.isPending}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Reference Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder="Enter reference number (optional)"
                value={formData.referenceNumber}
                onChangeText={(text) => setFormData({ ...formData, referenceNumber: text })}
                editable={!createPaymentMutation.isPending}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                disabled={createPaymentMutation.isPending}
              >
                <Text className="text-gray-900 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-green-600 rounded-lg py-3 items-center"
                disabled={createPaymentMutation.isPending}
              >
                {createPaymentMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold">Record Payment</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
