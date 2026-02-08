/**
 * ETF service with type-safe error handling
 * Uses better-result for error handling consistency
 */
import { Result } from "better-result";
import { NetworkError } from "~/lib/errors";
import type { FetchError } from "~/lib/errors";

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

/**
 * Fetch ETF dividend data with simulated price fluctuations
 * Returns success result with randomized prices for demo purposes
 */
export async function fetchETFData(): Promise<Result<ETFData[], FetchError>> {
    return Result.tryPromise({
        try: async () => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Simulate random price fluctuations
            return TOP_DIVIDEND_ETFS.map((etf) => ({
                ...etf,
                price: etf.price * (1 + (Math.random() - 0.5) * 0.02),
                dividendYield:
                    etf.dividendYield *
                    (1 + (Math.random() - 0.5) * 0.01),
            }));
        },
        catch: (error) => {
            return new NetworkError({
                url: "etf-data",
                cause: error,
            });
        },
    });
}

export type { ETFData };
