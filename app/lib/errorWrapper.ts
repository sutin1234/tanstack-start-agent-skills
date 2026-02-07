import type { Result } from "better-result";
import { matchError } from "better-result";
import type { FetchError } from "~/lib/errors";

export function errorWrapper<T>(result: Result<T, FetchError>) {
    if (result.isErr()) {
        const message = matchError(result.error, {
            ApiError: (e) => `API Error: ${e.status} - ${e.statusText}`,
            NetworkError: (e) => `Network Error: ${e.message}`,
            ParseError: (e) => `Parse Error: ${e.message}`,
        });
        throw new Error(String(message));
    }
    return result.value;
}