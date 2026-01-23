import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { apiClient } from "@/lib/api";

export function useCreateVehicle(flatId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleData: any) => {
      const response = await apiClient.createVehicle(vehicleData);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flat", flatId] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      Alert.alert("Success", "Vehicle added successfully");
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to create vehicle");
    },
  });
}
