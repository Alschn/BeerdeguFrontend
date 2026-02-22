import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type BeerCreatePayload,
  type BeersParams,
  createBeer,
  getBeers,
} from "~/api/beers";
import type { Beer, PaginatedResponseData } from "~/api/types";
import { getNextPageParam } from "~/utils/tanstack-query";

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

interface UseBeersOptions extends UseBeersPageOptions {
  initialData?: PaginatedResponseData<Beer>;
  initialDataUpdatedAt?: number;
}

export const useBeers = (options: UseBeersOptions) => {
  const initialData = !!options.initialData
    ? { pages: [options.initialData], pageParams: [1] }
    : undefined;

  return useInfiniteQuery({
    queryKey: [QUERY_KEY_BEERS, options.params] as const,
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const res = await getBeers({
        page: pageParam as number,
        ...queryKey[1],
      });
      return res.data;
    },
    getNextPageParam: getNextPageParam,
    staleTime: options.staleTime,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    initialData: initialData,
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    enabled: options.enabled ?? true,
  });
};

interface UseBeerCreateMutationOptions {
  onSuccess?: (
    data?: Awaited<ReturnType<typeof createBeer>>,
    variables?: BeerCreatePayload,
    context?: unknown
  ) => void;
  onError?: (
    error?: unknown,
    variables?: BeerCreatePayload,
    context?: unknown
  ) => void;
}

export const useBeerAddMutation = (options?: UseBeerCreateMutationOptions) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (data: BeerCreatePayload) => createBeer(data),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      await client.invalidateQueries([QUERY_KEY_BEERS]);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
};
