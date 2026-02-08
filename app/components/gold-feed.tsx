"use client";

import { AlertCircle, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
import { useGoldPrice } from "~/hooks/useGoldPrice";
import type { GoldData } from "~/services/gold.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

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
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1">
                        <CardTitle className="text-base">{title}</CardTitle>
                        <CardDescription className="text-xs">{subtitle}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">รับซื้อ</div>
                        <div className="text-lg font-bold">฿{formatPrice(buyPrice)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">ขายออก</div>
                        <div className="text-lg font-bold text-primary">฿{formatPrice(sellPrice)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">ส่วนต่าง</div>
                        <div className="text-lg font-bold">฿{formatPrice(Math.abs(spread))}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Loading Skeleton Component
function LoadingSkeleton() {
    return (
        <div className="space-y-4 p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-9 w-24" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-24 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-3">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                            </div>
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
                            <CardTitle className="text-destructive">ไม่สามารถโหลดราคาทองได้</CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button onClick={onRetry} variant="destructive" className="w-full">
                        ลองใหม่อีกครั้ง
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

// Main Gold Feed Component
export function GoldFeed() {
    const { data, error, isLoading, refetch } = useGoldPrice();

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

    // Derived values - React 19 compiler optimizes automatically
    const isUp = data.change.compareYesterday === "+";
    const changeIcon = isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
    const changeText = isUp ? "ปรับขึ้น" : "ปรับลง";

    return (
        <div className="space-y-6 p-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🥇</span>
                        <h2 className="text-3xl font-bold">ราคาทองคำวันนี้</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{data.date}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge variant={isUp ? "default" : "destructive"} className="w-fit">
                        <span className="flex items-center gap-1">
                            {changeIcon}
                            {changeText}
                        </span>
                    </Badge>
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        size="icon"
                        title="รีเฟรชราคา"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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

            <div className="text-center space-y-1 text-xs text-muted-foreground">
                <div>อัปเดต: {data.updateTime}</div>
                <div>ข้อมูลจากสมาคมค้าทองคำ</div>
            </div>
        </div>
    );
}

export default GoldFeed;
