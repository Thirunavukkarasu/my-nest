import { apiClient } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useUpdateFlat(flatId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (flatData: { flatId: number; flatNumber?: string; floorNumber?: number }) => {
      const response = await apiClient.updateFlat(flatData.flatId, flatData);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flat", flatId] });
      queryClient.invalidateQueries({ queryKey: ["flats"] });
      Alert.alert("Success", "Flat updated successfully");
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to update flat");
    },
  });
}

export function useCreateFlat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (flatData: {
      floorNumber: number;
      flatNumber: string;
      owner: {
        firstName: string;
        lastName: string;
        email?: string;
        phone?: string;
      };
    }) => {
      const response = await apiClient.createFlat(flatData);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flats"] });
      Alert.alert("Success", "Flat and owner added successfully");
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to create flat");
    },
  });
}
