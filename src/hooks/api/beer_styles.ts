import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getBeerStyles, type BeerStylesParams } from "~/api/beer_styles";
import type { PaginatedResponseData, BeerStyle } from "~/api/types";
import { getNextPageParam } from "~/utils/tanstack-query";

export const QUERY_KEY_BEER_STYLES = "beer_styles";

interface UseBeerStylesPageOptions {
  params: BeerStylesParams;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}

export const useBeerStylesPage = (options: UseBeerStylesPageOptions) => {
  return useQuery({
    queryKey: [QUERY_KEY_BEER_STYLES, options.params] as const,
    queryFn: async ({ queryKey }) => {
      const params = queryKey[1];
      const res = await getBeerStyles(params);
      return res.data;
    },
    staleTime: options?.staleTime ?? 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true,
  });
};

interface UseBeerStylesOptions extends UseBeerStylesPageOptions {
  initialData: PaginatedResponseData<BeerStyle>;
  initialDataUpdatedAt?: number;
}

export const useBeerStyles = (options: UseBeerStylesOptions) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY_BEER_STYLES, options.params] as const,
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const res = await getBeerStyles({
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
  });
};
