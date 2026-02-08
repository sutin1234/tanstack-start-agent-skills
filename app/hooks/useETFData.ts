/**
 * Custom hook for fetching ETF dividend data
 * 
 * Uses TanStack Query for data fetching and caching
 * Following best practices:
 * - qk-array-structure: Uses array for query keys
 * - cache-stale-time: 5 minute stale time for ETF data
 * - err-retry-config: Configured retry logic
 * - Service layer: Uses fetchETFData() from etf.service.ts
 */
import { useQuery } from "@tanstack/react-query";
import { fetchETFData } from "~/services/etf.service";
import type { ETFData } from "~/services/etf.service";

/**
 * Hook to fetch ETF dividend data
 */
export function useETFData() {
    return useQuery({
        queryKey: ["etf-dividends"],
        queryFn: async () => {
            const result = await fetchETFData();
            if (result.isErr()) throw new Error(result.error.message);
            return result.value;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // Refetch every minute
        retry: 3,
    });
}

export type { ETFData };
