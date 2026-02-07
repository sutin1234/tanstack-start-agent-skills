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
 */
"use client";

import { useUsers } from "~/hooks/useUsers";
import type { User } from "~/types/users.type";
import "./user-list.css";

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
        <div className="user-list-loading">
            <div className="skeleton-header">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-badge" />
            </div>
            <div className="skeleton-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-card">
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                            <div className="skeleton skeleton-avatar" />
                            <div>
                                <div className="skeleton skeleton-name" />
                                <div className="skeleton skeleton-username" />
                            </div>
                        </div>
                        <div className="skeleton skeleton-info" />
                        <div className="skeleton skeleton-info" />
                        <div className="skeleton skeleton-info" />
                    </div>
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
        <div className="user-list-error">
            <div className="error-icon">⚠️</div>
            <h3>Failed to load users</h3>
            <p>{message}</p>
            <button onClick={onRetry} className="retry-button">
                Try Again
            </button>
        </div>
    );
}

/**
 * Empty State Component
 */
function EmptyState() {
    return (
        <div className="user-list-empty">
            <div className="empty-icon">👥</div>
            <h3>No users found</h3>
            <p>There are no users to display at this time.</p>
        </div>
    );
}

/**
 * User Card Component
 * React 19 handles optimization automatically
 */
function UserCard({ user }: { user: User }) {
    return (
        <div className="user-card">
            <div className="card-header">
                <div className="avatar">{getInitials(user.name)}</div>
                <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="username">@{user.username}</p>
                </div>
            </div>

            <div className="card-body">
                <div className="info-row">
                    <span className="info-icon">📧</span>
                    <span className="info-text">
                        <a href={`mailto:${user.email}`}>{user.email.toLowerCase()}</a>
                    </span>
                </div>

                <div className="info-row">
                    <span className="info-icon">📞</span>
                    <span className="info-text">{user.phone}</span>
                </div>

                <div className="info-row">
                    <span className="info-icon">🌐</span>
                    <span className="info-text">
                        <a
                            href={`https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {user.website}
                        </a>
                    </span>
                </div>

                <div className="info-row">
                    <span className="info-icon">📍</span>
                    <span className="info-text">
                        {user.address.city}, {user.address.street}
                    </span>
                </div>
            </div>

            <div className="card-footer">
                <span className="company-badge">🏢 {user.company.name}</span>
            </div>
        </div>
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
        <div className="user-list-container">
            <div className="user-list-header">
                <div className="header-title">
                    <span className="user-icon">👥</span>
                    <h2>User Directory</h2>
                </div>

                <div className="header-actions">
                    <span className="user-count">
                        {users.length} users
                    </span>
                    <button
                        onClick={() => refetch()}
                        className={`refresh-button ${isFetching ? "loading" : ""}`}
                        disabled={isFetching}
                    >
                        <span className="refresh-icon">↻</span>
                        {isFetching ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            <div className="user-grid">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

export default UserList;
