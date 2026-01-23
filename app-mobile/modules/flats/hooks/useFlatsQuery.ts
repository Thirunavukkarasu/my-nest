import { adaptFlats } from "@/lib/adapters";
import { apiClient } from "@/lib/api";
import { Flat } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface FlatWithOwner extends Flat {
  owner?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

export function useFlatsQuery() {
  return useQuery<FlatWithOwner[]>({
    queryKey: ["flats"],
    queryFn: async () => {
      const response = await apiClient.getFlats({
        page: 1,
        limit: 100,
        sortCriterias: [],
      });

      if (response.error) {
        throw new Error(response.error || "Failed to load flats");
      }

      if (response.data?.data) {
        const apiFlats = response.data.data as any[];
        return apiFlats.map((apiFlat) => {
          const flat = adaptFlats([apiFlat])[0];
          // Extract owner information from residents
          const owner = apiFlat.residents?.find(
            (r: any) => r.isPrimaryTenant
          );
          return {
            ...flat,
            owner: owner
              ? {
                name: `${owner.firstName} ${owner.lastName}`,
                phone: owner.phone,
                email: owner.email,
              }
              : undefined,
          };
        });
      }
      return [];
    },
  });
}

export type { FlatWithOwner };
