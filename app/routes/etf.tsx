"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ETFFeed from "../components/etf-feed";
import "../components/etf-feed.css";
import type { Route } from "./+types/etf";

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 3,
        },
    },
});

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Top Dividend ETFs | Best Yield ETFs for Passive Income" },
        {
            name: "description",
            content:
                "Discover the best dividend ETFs with high yields for passive income. Compare SCHD, VYM, JEPI, HDV and more.",
        },
    ];
}

export default function ETF() {
    return (
        <QueryClientProvider client={queryClient}>
            <main
                style={{
                    minHeight: "100vh",
                    background: "linear-gradient(180deg, #050a15 0%, #0a1628 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                }}
            >
                <ETFFeed />
            </main>
        </QueryClientProvider>
    );
}
