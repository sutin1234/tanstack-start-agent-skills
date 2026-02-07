/**
 * React Query Provider
 * 
 * Following TanStack Query best practices:
 * - cache-defaults: Sets sensible defaults at QueryClient level
 * - ssr-client-per-request: Handles client creation appropriately
 * - err-retry-config: Configured retry logic
 */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * Default options for the QueryClient
 * Following cache-defaults and err-retry-config rules
 */
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data is considered fresh for 1 minute by default
                staleTime: 60 * 1000,
                // Keep inactive data cached for 10 minutes
                gcTime: 10 * 60 * 1000,
                // Retry failed queries 3 times
                retry: 3,
                // Exponential backoff for retries
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                // Don't refetch on window focus by default
                refetchOnWindowFocus: false,
                // Keep previous data while fetching new data
                placeholderData: (previousData: unknown) => previousData,
            },
            mutations: {
                // Don't retry mutations by default
                retry: 0,
            },
        },
    });
}

// Browser-side QueryClient singleton
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get or create QueryClient
 * For SSR, creates a new client per request (ssr-client-per-request)
 * For browser, reuses the same client
 */
function getQueryClient() {
    if (typeof window === "undefined") {
        // Server: always create a new client
        return makeQueryClient();
    }

    // Browser: create client once and reuse
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

/**
 * Query Provider Component
 * Wraps the application with React Query context
 */
export function QueryProvider({ children }: { children: ReactNode }) {
    // Using useState to ensure the QueryClient is only created once
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default QueryProvider;
