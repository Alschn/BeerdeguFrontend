import type { AxiosResponse } from "axios";
import type { PaginatedResponseData } from "../api/types";

type PaginatedAxiosResponse<T = unknown> = AxiosResponse<
  PaginatedResponseData<T>
>;

export function getNextPageParam(
  lastPage: PaginatedAxiosResponse,
  _allPages?: PaginatedAxiosResponse[]
) {
  const nextPageUrl: string | null = lastPage.data.next;
  if (nextPageUrl && nextPageUrl.includes("page=")) {
    const url = new URL(nextPageUrl);
    const page = url.searchParams.get("page") as string;
    const parsed = parseInt(page);
    return !isNaN(parsed) ? parsed : undefined;
  }
  return undefined;
}
