/**
 * Query Key Factory Pattern
 * Following TanStack Query best practices (qk-factory-pattern)
 * 
 * Organized hierarchically: entity → id → filters
 */

export const userKeys = {
    // All user-related queries
    all: ["users"] as const,

    // List queries with optional filters
    lists: () => [...userKeys.all, "list"] as const,

    // Single user by ID
    detail: (id: number) => [...userKeys.all, "detail", id] as const,

    // User by filters (pagination, search, etc.)
    filtered: (filters: Record<string, unknown>) =>
        [...userKeys.lists(), filters] as const,
};

// Example usage for other entities:
// export const postKeys = {
//   all: ["posts"] as const,
//   lists: () => [...postKeys.all, "list"] as const,
//   detail: (id: number) => [...postKeys.all, "detail", id] as const,
// };
