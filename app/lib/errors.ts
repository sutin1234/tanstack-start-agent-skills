/**
 * Custom TaggedError classes for domain-specific error handling
 * Following better-result adoption patterns
 */
import { TaggedError } from "better-result";

/**
 * Error thrown when an API request fails
 */
export class ApiError extends TaggedError("ApiError")<{
    status: number;
    statusText: string;
    url: string;
    message: string;
}>() {
    constructor(args: { status: number; statusText: string; url: string }) {
        super({
            ...args,
            message: `API request failed: ${args.status} ${args.statusText} (${args.url})`,
        });
    }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends TaggedError("NetworkError")<{
    url: string;
    cause: unknown;
    message: string;
}>() {
    constructor(args: { url: string; cause: unknown }) {
        const errorMessage =
            args.cause instanceof Error ? args.cause.message : String(args.cause);
        super({
            ...args,
            message: `Network error fetching ${args.url}: ${errorMessage}`,
        });
    }
}

/**
 * Error thrown when JSON parsing fails
 */
export class ParseError extends TaggedError("ParseError")<{
    cause: unknown;
    message: string;
}>() {
    constructor(args: { cause: unknown }) {
        const errorMessage =
            args.cause instanceof Error ? args.cause.message : String(args.cause);
        super({
            ...args,
            message: `Failed to parse response: ${errorMessage}`,
        });
    }
}

/**
 * Union type for all fetch-related errors
 */
export type FetchError = ApiError | NetworkError | ParseError;
