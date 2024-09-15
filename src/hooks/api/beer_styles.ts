import { useQuery } from "@tanstack/react-query";
import { getBeerStyles, type BeerStylesParams } from "~/api/beer_styles";

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
