import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { apiClient } from "@/lib/api";

export function useCreatePayment(flatId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiClient.createLedgerEntry({
        transactionDate: paymentData.paymentDate,
        entryType: "credit",
        category: paymentData.paymentType === "payout" ? "payout" : "maintenance",
        flatId: paymentData.flatId ? parseInt(paymentData.flatId) : undefined,
        residentId: parseInt(paymentData.residentId),
        amount: paymentData.amount,
        status: "completed",
        paymentMethod: paymentData.paymentMethod || undefined,
        referenceNumber: paymentData.referenceNumber || undefined,
      });
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flat", flatId] });
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
      Alert.alert("Success", "Payment recorded successfully");
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to record payment");
    },
  });
}
