import { useQuery } from "@tanstack/react-query";
import { getHops, type HopsParams } from "~/api/hops";

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
