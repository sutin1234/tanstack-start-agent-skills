/**
 * UserList Component
 * 
 * Displays a list of users fetched from JSONPlaceholder API
 * 
 * Uses:
 * - TanStack Query for data fetching with proper caching
 * - better-result for type-safe error handling
 * - TanStack Router patterns (component can be used in routes)
 * - Modern React 19 patterns (no manual memoization needed)
 * - shadcn/ui components for styling
 */
"use client";

import { AlertCircle, Users as UsersIcon, RotateCcw } from "lucide-react";
import { useUsers } from "~/hooks/useUsers";
import type { User } from "~/types/users.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

/**
 * Get initials from name
 */
function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("");
}

/**
 * Loading Skeleton - Premium shimmer effect
 */
function LoadingSkeleton() {
    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

/**
 * Error Display Component
 */
function ErrorDisplay({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
            <Card className="w-full max-w-md border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                            <CardTitle className="text-destructive">Failed to load users</CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button onClick={onRetry} variant="destructive" className="w-full">
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Empty State Component
 */
function EmptyState() {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="text-4xl mb-2">👥</div>
                    <CardTitle>No users found</CardTitle>
                    <CardDescription>There are no users to display at this time.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}

/**
 * User Card Component
 * React 19 handles optimization automatically
 */
function UserCard({ user }: { user: User }) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{user.name}</CardTitle>
                        <CardDescription className="text-xs">@{user.username}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">📧</span>
                    <span className="text-sm truncate">
                        <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                            {user.email.toLowerCase()}
                        </a>
                    </span>
                </div>
                <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">📞</span>
                    <span className="text-sm">{user.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">🌐</span>
                    <span className="text-sm truncate">
                        <a
                            href={`https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            {user.website}
                        </a>
                    </span>
                </div>
                <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">📍</span>
                    <span className="text-sm">{user.address.city}, {user.address.street}</span>
                </div>
            </CardContent>
            <div className="px-6 py-4 border-t">
                <Badge variant="secondary">
                    🏢 {user.company.name}
                </Badge>
            </div>
        </Card>
    );
}

/**
 * Main UserList Component
 */
export function UserList() {
    const { data: users, isLoading, isError, error, refetch, isFetching } = useUsers();

    // Loading state
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    // Error state
    if (isError) {
        return (
            <ErrorDisplay
                message={error?.message || "An unexpected error occurred"}
                onRetry={() => refetch()}
            />
        );
    }

    // Empty state
    if (!users || users.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <UsersIcon className="h-8 w-8" />
                    <h2 className="text-3xl font-bold">User Directory</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge variant="outline" className="w-fit">
                        {users.length} {users.length === 1 ? 'user' : 'users'}
                    </Badge>
                    <Button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        variant="default"
                        size="sm"
                    >
                        <RotateCcw className="h-4 w-4" />
                        {isFetching ? "Refreshing..." : "Refresh"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

export default UserList;
