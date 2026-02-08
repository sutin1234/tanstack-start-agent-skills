/**
 * Custom hook for fetching Thai Gold price data
 * 
 * Uses TanStack Query for data fetching and caching
 * Following best practices:
 * - qk-array-structure: Uses array for query keys
 * - cache-stale-time: 1 minute stale time for price data
 * - err-retry-config: Configured retry logic
 * - Service layer: Uses fetchGoldPrice() from gold.service.ts
 */
import { useQuery } from "@tanstack/react-query";
import { fetchGoldPrice } from "~/services/gold.service";
import type { GoldData } from "~/services/gold.service";

/**
 * Hook to fetch Gold price
 */
export function useGoldPrice() {
    return useQuery({
        queryKey: ["gold-price"],
        queryFn: async () => {
            const result = await fetchGoldPrice();
            if (result.isErr()) throw new Error(result.error.message);
            return result.value;
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: 60 * 1000, // Refetch every 60 seconds
        retry: 3,
    });
}

export type { GoldData };
