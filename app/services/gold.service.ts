/**
 * Thai Gold price service with type-safe error handling
 * Uses better-result for error handling consistency
 */
import { Result } from "better-result";
import { safeFetch } from "~/lib/api";
import { ApiError } from "~/lib/errors";
import type { FetchError } from "~/lib/errors";

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

// Raw API response from chnwt.dev
interface GoldRawResponse {
    status: string;
    response: {
        date: string;
        update_time: string;
        price: {
            gold_bar: {
                buy: string;
                sell: string;
            };
            gold: {
                buy: string;
                sell: string;
            };
            change: {
                compare_previous: string;
                compare_yesterday: string;
            };
        };
    };
}

const GOLD_API = "https://api.chnwt.dev/thai-gold-api/latest";

/**
 * Parse price string to number (e.g., "74,200.00" -> 74200.00)
 */
function parsePrice(priceStr: string | undefined): number {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace(/,/g, "")) || 0;
}

/**
 * Fetch Thai Gold price from chnwt.dev API
 * Transforms raw API response to standardized format
 */
export async function fetchGoldPrice(): Promise<Result<GoldData, FetchError>> {
    const result = await safeFetch<GoldRawResponse>(GOLD_API);

    if (result.isErr()) {
        return result;
    }

    const data = result.value;

    // Check if API returned success status
    if (data.status !== "success") {
        return Result.err(
            new ApiError({
                status: 400,
                statusText: "Bad Request",
                url: GOLD_API,
            })
        );
    }

    const { response: goldData } = data;

    return Result.ok({
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
    });
}

export type { GoldData, GoldPrice };
