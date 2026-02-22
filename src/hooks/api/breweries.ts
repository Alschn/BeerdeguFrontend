import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { type BreweriesParams, getBreweries } from "~/api/breweries";
import type { Brewery, PaginatedResponseData } from "~/api/types";
import { getNextPageParam } from "~/utils/tanstack-query";

const QUERY_KEY_BREWERIES = "breweries";

interface UseBreweriesPageOptions {
  params: BreweriesParams;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}

export const useBreweriesPage = (options: UseBreweriesPageOptions) => {
  return useQuery({
    queryKey: [QUERY_KEY_BREWERIES, options.params] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const res = await getBreweries({
        page: pageParam as number,
        ...queryKey[1],
      });
      return res.data;
    },
    staleTime: options?.staleTime ?? 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true,
  });
};

interface UseBreweriesOptions extends UseBreweriesPageOptions {
  initialData: PaginatedResponseData<Brewery>;
  initialDataUpdatedAt?: number;
}

export const useBreweries = (options: UseBreweriesOptions) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY_BREWERIES, options.params] as const,
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const res = await getBreweries({
        ...queryKey[1],
        page: pageParam as number,
      });
      return res.data;
    },
    getNextPageParam: getNextPageParam,
    staleTime: options.staleTime,
    initialData: {
      pages: [options.initialData],
      pageParams: [1],
    },
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    enabled: options.enabled ?? true,
  });
};
