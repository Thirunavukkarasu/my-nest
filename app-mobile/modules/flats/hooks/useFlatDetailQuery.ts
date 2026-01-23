import { adaptFlat, adaptPayments, adaptResidents, adaptVehicles } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { Flat, Payment, Resident, Vehicle } from "@/types";
import { useQuery } from "@tanstack/react-query";

export interface FlatDetailData {
  flat: Flat;
  residents: Resident[];
  payments: Payment[];
  vehicles: Vehicle[];
}

export function useFlatDetailQuery(flatId: string | undefined) {
  return useQuery<FlatDetailData | null>({
    queryKey: ["flat", flatId],
    queryFn: async () => {
      if (!flatId) return null;

      const response = await apiClient.getFlatById(parseInt(flatId));
      if (response.error) {
        throw new Error(response.error);
      }

      const flatData = response.data?.data;
      if (!flatData) return null;

      const flat = adaptFlat(flatData);
      const residents = flatData.residents ? adaptResidents(flatData.residents) : [];
      const payments = flatData.payments ? adaptPayments(flatData.payments) : [];
      const vehicles = flatData.vehicles ? adaptVehicles(flatData.vehicles) : [];

      return {
        flat,
        residents,
        payments,
        vehicles,
      };
    },
    enabled: !!flatId,
  });
}
