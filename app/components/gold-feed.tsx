"use client";

import useSWR from "swr";

// Types for Gold API response
interface GoldPrice {
    buy: number;
    sell: number;
}

interface GoldData {
    time: number;
    date: string;
    updateTime: string;
    prices: {
        goldBar: GoldPrice;
        goldOrnament: GoldPrice;
    };
    change: {
        comparePrevious: string;
        compareYesterday: string;
    };
}

// Gold API URL
const GOLD_API = "https://api.chnwt.dev/thai-gold-api/latest";

// Parse price string to number (e.g., "74,200.00" -> 74200.00)
function parsePrice(priceStr: string | undefined): number {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace(/,/g, "")) || 0;
}

// Fetcher function with error handling (js-early-exit pattern)
const fetcher = async (url: string): Promise<GoldData> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch gold price");
    }

    const data = await response.json();

    // Early exit if status is not success
    if (data.status !== "success") {
        throw new Error("API returned error status");
    }

    const { response: goldData } = data;

    return {
        time: Date.now(),
        date: goldData.date || "",
        updateTime: goldData.update_time || "",
        prices: {
            goldBar: {
                buy: parsePrice(goldData.price?.gold_bar?.buy),
                sell: parsePrice(goldData.price?.gold_bar?.sell),
            },
            goldOrnament: {
                buy: parsePrice(goldData.price?.gold?.buy),
                sell: parsePrice(goldData.price?.gold?.sell),
            },
        },
        change: {
            comparePrevious: goldData.price?.change?.compare_previous || "",
            compareYesterday: goldData.price?.change?.compare_yesterday || "",
        },
    };
};

// Format price - React 19 compiler handles optimization
function formatPrice(price: number): string {
    return new Intl.NumberFormat("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
}

// Gold Price Card Component - React 19 doesn't need memo()
function GoldPriceCard({
    title,
    subtitle,
    buyPrice,
    sellPrice,
    icon,
}: {
    title: string;
    subtitle: string;
    buyPrice: number;
    sellPrice: number;
    icon: string;
}) {
    // Calculate spread
    const spread = sellPrice - buyPrice;

    return (
        <div className="gold-price-card">
            <div className="gold-card-header">
                <div className="gold-card-title">
                    <span className="card-icon">{icon}</span>
                    <div>
                        <span className="gold-title">{title}</span>
                        <span className="gold-subtitle">{subtitle}</span>
                    </div>
                </div>
            </div>
            <div className="gold-prices-row">
                <div className="price-column">
                    <span className="price-label">รับซื้อ</span>
                    <span className="price-value buy">฿{formatPrice(buyPrice)}</span>
                </div>
                <div className="price-column">
                    <span className="price-label">ขายออก</span>
                    <span className="price-value sell">฿{formatPrice(sellPrice)}</span>
                </div>
                <div className="price-column spread">
                    <span className="price-label">ส่วนต่าง</span>
                    <span className="price-value">฿{formatPrice(Math.abs(spread))}</span>
                </div>
            </div>
        </div>
    );
}

// Loading Skeleton Component
function LoadingSkeleton() {
    return (
        <div className="gold-feed loading">
            <div className="gold-header">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-badge" />
            </div>
            <div className="gold-grid">
                {[1, 2].map((i) => (
                    <div key={i} className="gold-price-card skeleton-card">
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
        <div className="gold-feed error">
            <div className="error-icon">⚠️</div>
            <h3>ไม่สามารถโหลดราคาทองได้</h3>
            <p>{message}</p>
            <button onClick={onRetry} className="retry-button">
                ลองใหม่อีกครั้ง
            </button>
        </div>
    );
}

// Main Gold Feed Component
export function GoldFeed() {
    // SWR for data fetching with automatic deduplication (client-swr-dedup)
    const { data, error, isLoading, mutate } = useSWR<GoldData>(
        GOLD_API,
        fetcher,
        {
            refreshInterval: 60000, // Refresh every 60 seconds
            revalidateOnFocus: true,
            dedupingInterval: 10000, // Dedupe requests within 10 seconds
        }
    );

    // Early return for loading state (js-early-exit)
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

    // Derived values - React 19 compiler optimizes automatically
    const isUp = data.change.compareYesterday === "+";
    const changeIcon = isUp ? "▲" : "▼";
    const changeText = isUp ? "ปรับขึ้น" : "ปรับลง";

    return (
        <div className="gold-feed">
            <div className="gold-header">
                <div className="header-title">
                    <span className="gold-icon">🥇</span>
                    <div className="header-text">
                        <h2>ราคาทองคำวันนี้</h2>
                        <span className="date-info">{data.date}</span>
                    </div>
                </div>
                <div className="header-status">
                    <span className={`status-badge ${isUp ? "up" : "down"}`}>
                        {changeIcon} {changeText}
                    </span>
                    <button
                        onClick={() => mutate()}
                        className="refresh-button"
                        title="รีเฟรชราคา"
                    >
                        ↻
                    </button>
                </div>
            </div>

            <div className="gold-grid">
                <GoldPriceCard
                    title="ทองคำแท่ง"
                    subtitle="Gold Bar 96.5%"
                    buyPrice={data.prices.goldBar.buy}
                    sellPrice={data.prices.goldBar.sell}
                    icon="📊"
                />
                <GoldPriceCard
                    title="ทองรูปพรรณ"
                    subtitle="Gold Ornament 96.5%"
                    buyPrice={data.prices.goldOrnament.buy}
                    sellPrice={data.prices.goldOrnament.sell}
                    icon="💍"
                />
            </div>

            <div className="gold-footer">
                <div className="last-updated">อัปเดต: {data.updateTime}</div>
                <div className="data-source">ข้อมูลจากสมาคมค้าทองคำ</div>
            </div>
        </div>
    );
}

export default GoldFeed;
