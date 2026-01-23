import { adaptVehicles } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { Vehicle } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useVehiclesQuery() {
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await apiClient.getVehicles({
        page: 1,
        limit: 100,
        sortCriterias: [{ columnName: "createdAt", columnOrder: "desc" }],
      });

      if (response.error) {
        throw new Error(response.error || "Failed to load vehicles");
      }

      if (response.data?.data) {
        const adaptedVehicles = adaptVehicles(response.data.data);
        return adaptedVehicles;
      }
      return [];
    },
  });
}
