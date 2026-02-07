
import type { Result } from "better-result";
import type { FetchError } from "~/lib/errors";
import { errorWrapper } from "~/lib/errorWrapper";

export function useErrorWrapper<T>(result: Result<T, FetchError>) {
    return errorWrapper(result);
}