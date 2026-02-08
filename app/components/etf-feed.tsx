"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useETFData } from "~/hooks/useETFData";
import type { ETFData } from "~/services/etf.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";


// Format currency
function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
}

// Format percentage
function formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
}

// ETF Card Component - React 19 doesn't need memo()
function ETFCard({ etf }: { etf: ETFData }) {
    const isHighYield = etf.dividendYield >= 4;
    const isLowCost = etf.expenseRatio <= 0.1;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-base">{etf.symbol}</CardTitle>
                        <CardDescription className="text-xs">{etf.name}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {isHighYield && <Badge variant="default">High Yield</Badge>}
                        {isLowCost && <Badge variant="secondary">Low Cost</Badge>}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-xs text-muted-foreground">Price</div>
                        <div className="text-lg font-semibold">{formatCurrency(etf.price)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Dividend Yield</div>
                        <div className="text-lg font-semibold text-primary">{formatPercent(etf.dividendYield)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Expense Ratio</div>
                        <div className="text-sm">{formatPercent(etf.expenseRatio)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">AUM</div>
                        <div className="text-sm">{etf.aum}</div>
                    </div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                    <Badge variant="outline" className="text-xs">{etf.frequency} Dividend</Badge>
                    <Badge variant="outline" className="text-xs">{etf.sector}</Badge>
                </div>
            </CardContent>
        </Card>
    );
}

// Loading Skeleton
function LoadingSkeleton() {
    return (
        <div className="space-y-4 p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-24 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-6 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
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
                            <CardTitle className="text-destructive">Failed to load ETF data</CardTitle>
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

// Main ETF Feed Component
export function ETFFeed() {
    const { data, error, isLoading, refetch } = useETFData();

    // Early return for loading (js-early-exit)
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    // Early return for error - no try...catch needed
    if (error) {
        return <ErrorDisplay message={error.message} onRetry={() => refetch()} />;
    }

    // Early return for no data
    if (!data) {
        return <LoadingSkeleton />;
    }

    // Sort by dividend yield (highest first)
    const sortedETFs = [...data].sort((a, b) => b.dividendYield - a.dividendYield);
    const avgYield = data.reduce((sum, etf) => sum + etf.dividendYield, 0) / data.length;

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">💰</span>
                        <h2 className="text-3xl font-bold">Top Dividend ETFs</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">Best yield dividend ETFs for passive income</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Card className="w-fit">
                        <CardContent className="px-4 py-2">
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground">Avg Yield</div>
                                <div className="text-lg font-bold text-primary">{formatPercent(avgYield)}</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        size="icon"
                        title="Refresh data"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedETFs.map((etf) => (
                    <ETFCard key={etf.symbol} etf={etf} />
                ))}
            </div>

            <div className="text-center space-y-1 pt-4 text-xs text-muted-foreground">
                <p>* Dividend yields are trailing 12-month yields and may vary</p>
                <p>Data for educational purposes only. Not financial advice.</p>
            </div>
        </div>
    );
}

export default ETFFeed;
