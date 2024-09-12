import { useQuery } from "@tanstack/react-query";
import { type BeersParams, getBeers } from "~/api/beers";

export const QUERY_KEY_BEERS = "beers";

interface UseBeersPageOptions {
  params: BeersParams;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
}

export const useBeersPage = (options: UseBeersPageOptions) => {
  return useQuery({
    queryKey: [QUERY_KEY_BEERS, options.params] as const,
    queryFn: async ({ queryKey }) => {
      const params = queryKey[1];
      const res = await getBeers(params);
      return res.data;
    },
    staleTime: options?.staleTime ?? 60 * 1000,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true,
  });
};
