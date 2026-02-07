"use client";

import useSWR from "swr";

// Types for Bitcoin API response
interface BitcoinPrice {
    USD: { last: number; symbol: string };
    EUR: { last: number; symbol: string };
    THB: { last: number; symbol: string };
}

interface BitcoinData {
    time: number;
    prices: BitcoinPrice;
}

// Bitcoin API URL
const BITCOIN_API = "https://blockchain.info/ticker";

// Fetcher function with error handling
const fetcher = async (url: string): Promise<BitcoinData> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch Bitcoin price");
    }

    const data = await response.json();

    return {
        time: Date.now(),
        prices: {
            USD: { last: data.USD?.last || 0, symbol: "$" },
            EUR: { last: data.EUR?.last || 0, symbol: "€" },
            THB: { last: data.THB?.last || 0, symbol: "฿" },
        },
    };
};

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
        <div className="price-card">
            <div className="price-card-header">
                <span className="currency-label">{currency}</span>
                <span className="currency-symbol">{symbol}</span>
            </div>
            <div className="price-value">
                {symbol}
                {formatPrice(price)}
            </div>
        </div>
    );
}

// Loading Skeleton Component
function LoadingSkeleton() {
    return (
        <div className="bitcoin-feed loading">
            <div className="bitcoin-header">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-badge" />
            </div>
            <div className="price-grid">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="price-card skeleton-card">
                        <div className="skeleton skeleton-label" />
                        <div className="skeleton skeleton-price" />
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
        <div className="bitcoin-feed error">
            <div className="error-icon">⚠️</div>
            <h3>Failed to load Bitcoin prices</h3>
            <p>{message}</p>
            <button onClick={onRetry} className="retry-button">
                Try Again
            </button>
        </div>
    );
}

// Main Bitcoin Feed Component
export function BitcoinFeed() {
    // SWR for data fetching with automatic deduplication
    const { data, error, isLoading, mutate } = useSWR<BitcoinData>(
        BITCOIN_API,
        fetcher,
        {
            refreshInterval: 30000,
            revalidateOnFocus: true,
            dedupingInterval: 5000,
        }
    );

    // Early return for loading state
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    // Early return for error state
    if (error) {
        return <ErrorDisplay message={error.message} onRetry={() => mutate()} />;
    }

    // Early return for no data
    if (!data) {
        return <LoadingSkeleton />;
    }

    // Derived values - React 19 compiler optimizes these automatically
    const lastUpdated = formatDate(data.time);
    const isStale = Date.now() - data.time > 60000;

    return (
        <div className="bitcoin-feed">
            <div className="bitcoin-header">
                <div className="header-title">
                    <span className="bitcoin-icon">₿</span>
                    <h2>Bitcoin Price Feed</h2>
                </div>
                <div className="header-status">
                    <span className={`status-badge ${isStale ? "stale" : "live"}`}>
                        {isStale ? "⏳ Stale" : "🟢 Live"}
                    </span>
                    <button
                        onClick={() => mutate()}
                        className="refresh-button"
                        title="Refresh prices"
                    >
                        ↻
                    </button>
                </div>
            </div>

            <div className="price-grid">
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

            <div className="last-updated">Last updated: {lastUpdated}</div>
        </div>
    );
}

export default BitcoinFeed;
