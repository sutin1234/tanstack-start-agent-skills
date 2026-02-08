/**
 * Custom hook for fetching Bitcoin price data
 * 
 * Uses TanStack Query for data fetching and caching
 * Following best practices:
 * - qk-array-structure: Uses array for query keys
 * - cache-stale-time: 5 minute stale time for price data
 * - err-retry-config: Configured retry logic
 * - Service layer: Uses fetchBitcoinPrice() from bitcoin.service.ts
 */
import { useQuery } from "@tanstack/react-query";
import { fetchBitcoinPrice } from "~/services/bitcoin.service";
import type { BitcoinData } from "~/services/bitcoin.service";

/**
 * Hook to fetch Bitcoin price
 */
export function useBitcoinPrice() {
    return useQuery({
        queryKey: ["bitcoin-price"],
        queryFn: async () => {
            const result = await fetchBitcoinPrice();
            if (result.isErr()) throw new Error(result.error.message);
            return result.value;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 30 * 1000, // Refetch every 30 seconds
        retry: 3,
    });
}

export type { BitcoinData };
