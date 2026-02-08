"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useBitcoinPrice } from "~/hooks/useBitcoinPrice";
import type { BitcoinData } from "~/services/bitcoin.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

// Format price - simple function, React 19 compiler handles optimization
function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
}

// Format date - simple function
function formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "medium",
    }).format(new Date(timestamp));
}

// Price Card Component - React 19 doesn't need memo()
function PriceCard({
    currency,
    price,
    symbol,
}: {
    currency: string;
    price: number;
    symbol: string;
}) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardDescription>{currency}</CardDescription>
                    <span className="text-lg font-bold">{symbol}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-primary">
                    {symbol}
                    {formatPrice(price)}
                </div>
            </CardContent>
        </Card>
    );
}

// Loading Skeleton Component
function LoadingSkeleton() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader className="pb-3">
                                <Skeleton className="h-4 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Skeleton className="h-4 w-48 mt-4" />
            </CardContent>
        </Card>
    );
}

// Error Component
function ErrorDisplay({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <div className="flex items-center justify-center min-h-[300px] p-6">
            <Card className="max-w-md w-full border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                            <CardTitle className="text-destructive">Failed to load Bitcoin prices</CardTitle>
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

// Main Bitcoin Feed Component
export function BitcoinFeed() {
    const { data, error, isLoading, refetch } = useBitcoinPrice();

    // Loading state
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    // Error state
    if (error) {
        return <ErrorDisplay message={error.message} onRetry={() => refetch()} />;
    }

    // No data state
    if (!data) {
        return <LoadingSkeleton />;
    }

    // Derived values - React 19 compiler optimizes these automatically
    const lastUpdated = formatDate(data.time);
    const isStale = Date.now() - data.time > 60000;

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">₿</span>
                        <CardTitle>Bitcoin Price Feed</CardTitle>
                    </div>
                    <CardDescription>{lastUpdated}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={isStale ? "secondary" : "default"}>
                        {isStale ? "⏳ Stale" : "🟢 Live"}
                    </Badge>
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        size="icon"
                        title="Refresh prices"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PriceCard
                        currency="US Dollar"
                        price={data.prices.USD.last}
                        symbol={data.prices.USD.symbol}
                    />
                    <PriceCard
                        currency="Euro"
                        price={data.prices.EUR.last}
                        symbol={data.prices.EUR.symbol}
                    />
                    <PriceCard
                        currency="Thai Baht"
                        price={data.prices.THB.last}
                        symbol={data.prices.THB.symbol}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

export default BitcoinFeed;
