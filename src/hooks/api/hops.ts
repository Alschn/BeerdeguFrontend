import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getHops, type HopsParams } from "~/api/hops";
import type { Hop, PaginatedResponseData } from "~/api/types";
import { getNextPageParam } from "~/utils/tanstack-query";

export const QUERY_KEY_HOPS = "hops";

interface UseHopsPageOptions {
  params: HopsParams;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}

export const useHopsPage = (options: UseHopsPageOptions) => {
  return useQuery({
    queryKey: [QUERY_KEY_HOPS, options.params] as const,
    queryFn: async ({ queryKey }) => {
      const params = queryKey[1];
      const res = await getHops(params);
      return res.data;
    },
    staleTime: options?.staleTime ?? 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true,
  });
};

interface UseHopsOptions extends UseHopsPageOptions {
  initialData: PaginatedResponseData<Hop>;
  initialDataUpdatedAt?: number;
}

export const useHops = (options: UseHopsOptions) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY_HOPS, options.params] as const,
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const res = await getHops({
        ...queryKey[1],
        page: pageParam as number,
      });
      return res.data;
    },
    getNextPageParam: getNextPageParam,
    staleTime: options?.staleTime,
    initialData: {
      pages: [options.initialData],
      pageParams: [1],
    },
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    enabled: options.enabled ?? true,
  });
};
