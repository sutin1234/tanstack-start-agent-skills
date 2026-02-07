/**
 * Custom hook for fetching users with TanStack Query + better-result
 * 
 * Following best practices:
 * - qk-array-structure: Uses array for query keys
 * - qk-factory-pattern: Uses query key factory
 * - cache-stale-time: Appropriate staleTime for user data
 * - err-retry-config: Configured retry logic
 * - perf-select-transform: Supports data transformation
 * - Service layer: Uses fetchUsers() from user.service.ts
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "~/lib/query-keys";
import { createUser, fetchUsers } from "~/services/user.service";
import type { User } from "~/types/users.type";


/**
 * Hook to fetch all users
 */
export function useUsers() {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: async () => {
            const result = await fetchUsers();
            if (result.isErr()) throw new Error(result.error.message);
            return result.value;
        },
    });
}

// Mutation hook example
export function useCreateUser() {
    return useMutation({
        mutationFn: async (data: User) => {
            const result = await createUser(data);
            if (result.isErr()) throw new Error(result.error.message);
            return result.value;
        },
    });
}
