"use client";

import { useQuery } from "@tanstack/react-query";

// Types for ETF data
interface ETFData {
    symbol: string;
    name: string;
    price: number;
    dividendYield: number;
    expenseRatio: number;
    aum: string;
    frequency: string;
    sector: string;
}

// Top dividend ETFs data (static data since there's no free real-time API)
const TOP_DIVIDEND_ETFS: ETFData[] = [
    {
        symbol: "SCHD",
        name: "Schwab U.S. Dividend Equity ETF",
        price: 82.45,
        dividendYield: 3.52,
        expenseRatio: 0.06,
        aum: "$58.2B",
        frequency: "Quarterly",
        sector: "Dividend Growth",
    },
    {
        symbol: "VYM",
        name: "Vanguard High Dividend Yield ETF",
        price: 118.32,
        dividendYield: 2.91,
        expenseRatio: 0.06,
        aum: "$52.1B",
        frequency: "Quarterly",
        sector: "High Yield",
    },
    {
        symbol: "HDV",
        name: "iShares Core High Dividend ETF",
        price: 108.76,
        dividendYield: 3.78,
        expenseRatio: 0.08,
        aum: "$10.8B",
        frequency: "Quarterly",
        sector: "High Yield",
    },
    {
        symbol: "JEPI",
        name: "JPMorgan Equity Premium Income ETF",
        price: 56.89,
        dividendYield: 7.42,
        expenseRatio: 0.35,
        aum: "$33.5B",
        frequency: "Monthly",
        sector: "Covered Call",
    },
    {
        symbol: "DIVO",
        name: "Amplify CWP Enhanced Dividend Income",
        price: 38.24,
        dividendYield: 4.68,
        expenseRatio: 0.55,
        aum: "$3.2B",
        frequency: "Monthly",
        sector: "Covered Call",
    },
    {
        symbol: "SPYD",
        name: "SPDR Portfolio S&P 500 High Dividend",
        price: 42.18,
        dividendYield: 4.21,
        expenseRatio: 0.07,
        aum: "$7.1B",
        frequency: "Quarterly",
        sector: "High Yield",
    },
];

// Simulate API fetch with slight delay
async function fetchETFData(): Promise<ETFData[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate random price fluctuations
    return TOP_DIVIDEND_ETFS.map((etf) => ({
        ...etf,
        price: etf.price * (1 + (Math.random() - 0.5) * 0.02),
        dividendYield: etf.dividendYield * (1 + (Math.random() - 0.5) * 0.01),
    }));
}

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
        <div className="etf-card">
            <div className="etf-card-header">
                <div className="etf-symbol-info">
                    <span className="etf-symbol">{etf.symbol}</span>
                    <span className="etf-name">{etf.name}</span>
                </div>
                <div className="etf-badges">
                    {isHighYield && <span className="badge high-yield">High Yield</span>}
                    {isLowCost && <span className="badge low-cost">Low Cost</span>}
                </div>
            </div>

            <div className="etf-stats">
                <div className="stat-item">
                    <span className="stat-label">Price</span>
                    <span className="stat-value price">{formatCurrency(etf.price)}</span>
                </div>
                <div className="stat-item highlight">
                    <span className="stat-label">Dividend Yield</span>
                    <span className="stat-value yield">{formatPercent(etf.dividendYield)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Expense Ratio</span>
                    <span className="stat-value expense">{formatPercent(etf.expenseRatio)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">AUM</span>
                    <span className="stat-value">{etf.aum}</span>
                </div>
            </div>

            <div className="etf-footer">
                <span className="frequency">{etf.frequency} Dividend</span>
                <span className="sector">{etf.sector}</span>
            </div>
        </div>
    );
}

// Loading Skeleton
function LoadingSkeleton() {
    return (
        <div className="etf-feed loading">
            <div className="etf-header">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-badge" />
            </div>
            <div className="etf-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="etf-card skeleton-card">
                        <div className="skeleton skeleton-header" />
                        <div className="skeleton skeleton-stats" />
                        <div className="skeleton skeleton-footer" />
                    </div>
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
        <div className="etf-feed error">
            <div className="error-icon">📉</div>
            <h3>Failed to load ETF data</h3>
            <p>{message}</p>
            <button onClick={onRetry} className="retry-button">
                Try Again
            </button>
        </div>
    );
}

// Main ETF Feed Component
export function ETFFeed() {
    // TanStack Query for data fetching (client-tanstack-query pattern)
    // No try...catch needed - error handling is automatic
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["etf-dividends"],
        queryFn: fetchETFData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // Refetch every minute
        retry: 3,
    });

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
        <div className="etf-feed">
            <div className="etf-header">
                <div className="header-title">
                    <span className="etf-icon">💰</span>
                    <div className="header-text">
                        <h2>Top Dividend ETFs</h2>
                        <span className="header-subtitle">Best yield dividend ETFs for passive income</span>
                    </div>
                </div>
                <div className="header-status">
                    <div className="avg-yield-badge">
                        <span className="avg-label">Avg Yield</span>
                        <span className="avg-value">{formatPercent(avgYield)}</span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="refresh-button"
                        title="Refresh data"
                    >
                        ↻
                    </button>
                </div>
            </div>

            <div className="etf-grid">
                {sortedETFs.map((etf) => (
                    <ETFCard key={etf.symbol} etf={etf} />
                ))}
            </div>

            <div className="etf-footer-info">
                <p>* Dividend yields are trailing 12-month yields and may vary</p>
                <p>Data for educational purposes only. Not financial advice.</p>
            </div>
        </div>
    );
}

export default ETFFeed;
