import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export interface LedgerEntry {
  ledgerId: number;
  flatId: number | null;
  residentId: number | null;
  entryType: "credit" | "debit";
  amount: number;
  description: string;
  transactionDate: string;
  runningBalance: number;
  createdAt: string;
  updatedAt: string;
}

export function useLedgerQuery() {
  const isImpersonating = useAuthStore((state) => state.isImpersonating);
  const impersonatedFlatId = useAuthStore((state) => state.impersonatedFlatId);

  return useQuery<LedgerEntry[]>({
    queryKey: ["ledger", impersonatedFlatId, isImpersonating],
    queryFn: async () => {
      // Build search criteria - filter by flatId if impersonating
      const searchCriterias = [];
      if (isImpersonating && impersonatedFlatId) {
        searchCriterias.push({
          columnName: "flatId",
          columnOperator: "equals" as const,
          columnValue: impersonatedFlatId.toString(),
        });
      }

      const response = await apiClient.getLedger({
        page: 1,
        limit: 100,
        searchCriterias,
        sortCriterias: [{ columnName: "transactionDate", columnOrder: "desc" }],
      });

      if (response.error) {
        throw new Error(response.error || "Failed to load ledger entries");
      }

      if (response.data?.data) {
        return response.data.data;
      }
      return [];
    },
  });
}
