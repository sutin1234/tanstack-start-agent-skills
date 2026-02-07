/**
 * API utilities using better-result for type-safe error handling
 * Following TanStack Query best practices with Result types
 */
import { Result } from "better-result";
import { ApiError, NetworkError, ParseError, type FetchError } from "./errors";

/**
 * Base request wrapper that returns Response
 * All other safe* functions reuse this for consistent error handling
 */
export async function safeRequest(
    url: string,
    options?: RequestInit
): Promise<Result<Response, FetchError>> {
    return Result.tryPromise({
        try: async () => {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new ApiError({
                    status: response.status,
                    statusText: response.statusText,
                    url,
                });
            }

            return response;
        },
        catch: (error) => {
            if (error instanceof ApiError) {
                return error;
            }
            if (error instanceof TypeError && error.message.includes("fetch")) {
                return new NetworkError({ url, cause: error });
            }
            return new NetworkError({ url, cause: error });
        },
    });
}

/**
 * Type-safe fetch wrapper that returns JSON Result
 * Reuses safeRequest for consistent error handling
 */
export async function safeFetch<T>(
    url: string,
    options?: RequestInit
): Promise<Result<T, FetchError>> {
    const responseResult = await safeRequest(url, options);

    if (responseResult.isErr()) {
        return Result.err(responseResult.error);
    }

    return Result.tryPromise({
        try: async () => responseResult.value.json() as Promise<T>,
        catch: (error) => {
            if (error instanceof SyntaxError) {
                return new ParseError({ cause: error });
            }
            return new NetworkError({ url, cause: error });
        },
    });
}

/**
 * Type-safe POST wrapper that reuses safeFetch
 * Automatically sets Content-Type to application/json
 */
export async function safePost<T, B = unknown>(
    url: string,
    body: B,
    options?: Omit<RequestInit, "method" | "body">
): Promise<Result<T, FetchError>> {
    return safeFetch<T>(url, {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        body: JSON.stringify(body),
    });
}

/**
 * Type-safe PUT wrapper that reuses safeFetch
 */
export async function safePut<T, B = unknown>(
    url: string,
    body: B,
    options?: Omit<RequestInit, "method" | "body">
): Promise<Result<T, FetchError>> {
    return safeFetch<T>(url, {
        ...options,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        body: JSON.stringify(body),
    });
}

/**
 * Type-safe PATCH wrapper that reuses safeFetch
 */
export async function safePatch<T, B = unknown>(
    url: string,
    body: B,
    options?: Omit<RequestInit, "method" | "body">
): Promise<Result<T, FetchError>> {
    return safeFetch<T>(url, {
        ...options,
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        body: JSON.stringify(body),
    });
}

/**
 * Type-safe DELETE wrapper that reuses safeFetch
 */
export async function safeDelete<T>(
    url: string,
    options?: Omit<RequestInit, "method">
): Promise<Result<T, FetchError>> {
    return safeFetch<T>(url, {
        ...options,
        method: "DELETE",
    });
}

/**
 * Type-safe file upload wrapper using multipart/form-data
 * Reuses safeFetch - does NOT set Content-Type (browser auto-sets with boundary)
 */
export async function safePostUpload<T>(
    url: string,
    formData: FormData,
    options?: Omit<RequestInit, "method" | "body" | "headers">
): Promise<Result<T, FetchError>> {
    return safeFetch<T>(url, {
        ...options,
        method: "POST",
        body: formData,
    });
}

/**
 * Download response type
 */
export interface DownloadResult {
    blob: Blob;
    filename: string | null;
    contentType: string | null;
}

/**
 * Extract filename from Content-Disposition header
 */
function extractFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;

    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, "");
    }
    return null;
}

/**
 * Convert Response to DownloadResult
 */
async function responseToDownloadResult(response: Response): Promise<DownloadResult> {
    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    const contentType = response.headers.get("Content-Type");

    return {
        blob,
        filename: extractFilename(contentDisposition),
        contentType,
    };
}

/**
 * Type-safe file download wrapper (GET)
 * Reuses safeRequest and returns Blob with filename
 */
export async function safeDownload(
    url: string,
    options?: RequestInit
): Promise<Result<DownloadResult, FetchError>> {
    const responseResult = await safeRequest(url, options);

    if (responseResult.isErr()) {
        return Result.err(responseResult.error);
    }

    return Result.tryPromise({
        try: async () => responseToDownloadResult(responseResult.value),
        catch: (error) => new NetworkError({ url, cause: error }),
    });
}

/**
 * Type-safe POST download wrapper
 * Reuses safeRequest - useful when download requires request body (e.g., report generation)
 */
export async function safePostDownload<B = unknown>(
    url: string,
    body: B,
    options?: Omit<RequestInit, "method" | "body">
): Promise<Result<DownloadResult, FetchError>> {
    const responseResult = await safeRequest(url, {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        body: JSON.stringify(body),
    });

    if (responseResult.isErr()) {
        return Result.err(responseResult.error);
    }

    return Result.tryPromise({
        try: async () => responseToDownloadResult(responseResult.value),
        catch: (error) => new NetworkError({ url, cause: error }),
    });
}
