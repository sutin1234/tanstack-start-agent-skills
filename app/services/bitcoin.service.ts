/**
 * Bitcoin price service with type-safe error handling
 * Uses better-result for error handling consistency
 */
import { Result } from "better-result";
import { safeFetch } from "~/lib/api";
import { NetworkError } from "~/lib/errors";
import type { FetchError } from "~/lib/errors";

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

// Raw API response from blockchain.info
interface BitcoinRawResponse {
    USD: { last: number };
    EUR: { last: number };
    THB: { last: number };
}

const BITCOIN_API = "https://blockchain.info/ticker";

/**
 * Fetch Bitcoin price from blockchain.info API
 * Transforms raw API response to standardized format
 */
export async function fetchBitcoinPrice(): Promise<
    Result<BitcoinData, FetchError>
> {
    const result = await safeFetch<BitcoinRawResponse>(BITCOIN_API);

    if (result.isErr()) {
        return result;
    }

    const data = result.value;

    return Result.ok({
        time: Date.now(),
        prices: {
            USD: { last: data.USD?.last || 0, symbol: "$" },
            EUR: { last: data.EUR?.last || 0, symbol: "€" },
            THB: { last: data.THB?.last || 0, symbol: "฿" },
        },
    });
}

export type { BitcoinData, BitcoinPrice };
