import { adaptPayments } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { Payment } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function usePaymentsQuery() {
  return useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      // Note: This appears to be a mock/placeholder screen
      // Payments are typically handled through ledger entries
      // For now, we'll return empty array
      // TODO: Implement actual payments API when available
      return [];
    },
  });
}
