import { useInfiniteQuery } from "@tanstack/react-query";
import { getRooms, type RoomsParams } from "~/api/rooms";
import type { PaginatedResponseData, Room } from "~/api/types";
import { getNextPageParam } from "~/utils/tanstack-query";

export const QUERY_KEY_ROOMS = "rooms";

interface UseRoomsOptions {
  params: RoomsParams;
  staleTime?: number;
  refetchOnReconnect?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  initialData?: PaginatedResponseData<Room>;
  initialDataUpdatedAt?: number;
  enabled?: boolean;
}

export const useRooms = (options: UseRoomsOptions) => {
  const initialData = !!options.initialData
    ? { pages: [options.initialData], pageParams: [1] }
    : undefined;

  return useInfiniteQuery({
    queryKey: [QUERY_KEY_ROOMS, options.params] as const,
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const res = await getRooms({ ...queryKey[1], page: pageParam as number });
      return res.data;
    },
    getNextPageParam: getNextPageParam,
    staleTime: options?.staleTime,
    refetchOnReconnect: options?.refetchOnReconnect ?? false,
    refetchOnMount: options?.refetchOnMount ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    initialData: initialData,
    initialDataUpdatedAt: options.initialDataUpdatedAt,
    enabled: options.enabled ?? true,
  });
};
