"use client";

import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Loader,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { type ChangeEvent, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { BeerPurchase, PaginatedResponseData } from "~/api/types";
import {
  getPurchases,
  type PurchasesParams,
} from "~/app/dashboard/(general)/purchases/actions";
import { getNextPageParam } from "~/utils/tanstack-query";
import PurchasesTable from "./PurchasesTable";
import SearchInput from "~/components/SearchInput";
import PurchaseAddModal from "./PurchaseAddModal";
import { notifications } from "@mantine/notifications";
import { APIError, isApiError } from "~/api/errors";
import { createPurchase, type CreatePurchasePayload } from "~/api/purchases";

interface PurchasesPageProps {
  initialData: PaginatedResponseData<BeerPurchase>;
}

const usePurchasesQuery = (
  initialData: PaginatedResponseData<BeerPurchase>,
  params: PurchasesParams
) => {
  return useInfiniteQuery({
    queryKey: ["purchases", params] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      return await getPurchases({
        page: pageParam as number,
        ...queryKey[1],
      });
    },
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
    initialDataUpdatedAt: new Date().getTime(),
    refetchOnWindowFocus: false,
    getNextPageParam: getNextPageParam,
  });
};

export default function PurchasesPage({ initialData }: PurchasesPageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [isAddModalOpen, addModalHandlers] = useDisclosure(false);

  const client = useQueryClient();

  // todo: add filters
  // existing: (packaging, price, volume, purchased_at)
  // to be added: (search, ordering)
  const purchasesParams: PurchasesParams = {
    search: debouncedSearch,
    page_size: 10,
  } as const;

  const {
    data: dataPurchases,
    isLoading: isLoadingPurchases,
    hasNextPage: hasNextPagePurchases,
    fetchNextPage: fetchNextPagePurchases,
  } = usePurchasesQuery(initialData, purchasesParams);

  const purchases = useMemo(() => {
    return dataPurchases?.pages.flatMap((page) => page.results) || [];
  }, [dataPurchases]);

  const handleFetchNextPage = async () => {
    if (!hasNextPagePurchases) return;
    await fetchNextPagePurchases();
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const createMutation = useMutation({
    mutationFn: (data: CreatePurchasePayload) => createPurchase(data),
    onSuccess: async () => {
      notifications.show({
        title: "Success!",
        message: "Purchase has been added",
        color: "green",
      });
      addModalHandlers.close();
      await client.invalidateQueries(["purchases"]);
    },
    onError: (error) => {
      if (!isApiError(error)) {
        notifications.show({
          title: "Something went wrong!",
          message: "Try again later...",
          color: "red",
        });
        return;
      }

      const _err = APIError.fromAxiosError(error);

      // todo: handle validation errors
      console.error(_err);

      notifications.show({
        title: "Could not create a new purchase!",
        message: "Please check if your data is correct.",
        color: "red",
      });
    },
  });

  const handleSubmit = (values: CreatePurchasePayload) => {
    createMutation.mutate(values);
  };

  // todo: add filters inputs, make modal multistep

  return (
    <Box>
      <PurchaseAddModal
        opened={isAddModalOpen}
        onClose={addModalHandlers.close}
        onSubmit={handleSubmit}
        isLoading={createMutation.isLoading}
      />
      <InfiniteScroll
        dataLength={purchases.length}
        next={handleFetchNextPage}
        hasMore={Boolean(hasNextPagePurchases)}
        loader={<></>}
        scrollThreshold={0.95}
        scrollableTarget="purchases-container"
      >
        <Card>
          <Flex justify="space-between" align="center">
            <SearchInput value={search} onChange={handleChangeSearch} mb={8} />
            <Button
              leftIcon={<IconPlus size="1rem" />}
              onClick={addModalHandlers.open}
            >
              Add purchase
            </Button>
          </Flex>
          <Divider mt="sm" />
          <Box
            id="purchases-container"
            h={{
              base: 700,
              "2xl": 1060,
            }}
            sx={{ overflow: "auto" }}
          >
            <PurchasesTable data={purchases} />
          </Box>
        </Card>
      </InfiniteScroll>
      {isLoadingPurchases && (
        <Center py="lg">
          <Loader size="lg" />
        </Center>
      )}
    </Box>
  );
}
