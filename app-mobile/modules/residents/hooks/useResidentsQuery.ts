import { adaptResidents } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { Resident } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useResidentsQuery() {
  return useQuery<Resident[]>({
    queryKey: ["residents"],
    queryFn: async () => {
      const response = await apiClient.getResidents({
        page: 1,
        limit: 100,
        sortCriterias: [{ columnName: "createdAt", columnOrder: "desc" }],
      });

      if (response.error) {
        throw new Error(response.error || "Failed to load residents");
      }

      if (response.data?.data) {
        const adaptedResidents = adaptResidents(response.data.data);
        return adaptedResidents;
      }
      return [];
    },
  });
}
