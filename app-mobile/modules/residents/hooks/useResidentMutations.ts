import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { apiClient } from "@/lib/api";

export function useCreateResident(flatId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (residentData: any) => {
      const response = await apiClient.createResident(residentData);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flat", flatId] });
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      Alert.alert("Success", "Resident added successfully");
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to create resident");
    },
  });
}
