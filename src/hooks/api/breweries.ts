import { useQuery } from "@tanstack/react-query";
import { type BreweriesParams, getBreweries } from "~/api/breweries";

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
