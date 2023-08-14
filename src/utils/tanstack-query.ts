import type { PaginatedResponseData } from "../api/types";

export function getNextPageParam(
  lastPage: PaginatedResponseData<unknown>,
  _allPages?: PaginatedResponseData<unknown>[]
) {
  const nextPageUrl: string | null = lastPage.next;
  if (nextPageUrl && nextPageUrl.includes("page=")) {
    const url = new URL(nextPageUrl);
    const page = url.searchParams.get("page") as string;
    const parsed = parseInt(page);
    return !isNaN(parsed) ? parsed : undefined;
  }
  return undefined;
}
