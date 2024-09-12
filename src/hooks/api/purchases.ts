import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createPurchase, type CreatePurchasePayload } from "~/api/purchases";
import type { BeerPurchase, PaginatedResponseData } from "~/api/types";
import {
  getPurchases,
  type PurchasesParams,
} from "~/app/dashboard/(general)/purchases/actions";
import { getNextPageParam } from "~/utils/tanstack-query";

export const QUERY_KEY_PURCHASES = "purchases";

interface UsePurchaseQueryOptions {
  initialData: PaginatedResponseData<BeerPurchase>;
  params: PurchasesParams;
  refetchOnWindowFocus?: boolean;
}

export const usePurchasesQuery = (options: UsePurchaseQueryOptions) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY_PURCHASES, options.params] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const params = queryKey[1];
      return await getPurchases({
        page: pageParam as number,
        ...params,
      });
    },
    initialData: {
      pages: [options.initialData],
      pageParams: [1],
    },
    initialDataUpdatedAt: new Date().getTime(),
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    getNextPageParam: getNextPageParam,
  });
};

interface UseCreatePurchaseMutationOptions {
  onSuccess?: (
    data?: Awaited<ReturnType<typeof createPurchase>>,
    variables?: CreatePurchasePayload,
    context?: unknown
  ) => void;
  onError?: (
    error?: unknown,
    variables?: CreatePurchasePayload,
    context?: unknown
  ) => void;
}

export const usePurchaseCreateMutation = (
  options?: UseCreatePurchaseMutationOptions
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePurchasePayload) => createPurchase(data),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      await client.invalidateQueries([QUERY_KEY_PURCHASES]);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
};
