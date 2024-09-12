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
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { type ChangeEvent, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { APIError, isApiError } from "~/api/errors";
import { type CreatePurchasePayload } from "~/api/purchases";
import type { BeerPurchase, PaginatedResponseData } from "~/api/types";
import { type PurchasesParams } from "~/app/dashboard/(general)/purchases/actions";
import SearchInput from "~/components/SearchInput";
import { usePurchaseCreateMutation, usePurchasesQuery } from "~/hooks/api";
import PurchaseAddModal from "./PurchaseAddModal";
import PurchasesTable from "./PurchasesTable";
import {
  getInitialSortingFromParams,
  useSorting,
} from "~/hooks/table/useSorting";

interface PurchasesPageProps {
  initialData: PaginatedResponseData<BeerPurchase>;
  initialParams?: PurchasesParams;
}

export default function PurchasesPage({
  initialData,
  initialParams,
}: PurchasesPageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const { sorting, onSortingChange, ordering } = useSorting(
    getInitialSortingFromParams(initialParams)
  );

  const [isAddModalOpen, addModalHandlers] = useDisclosure(false);

  const purchasesParams = useMemo<PurchasesParams>(() => {
    return {
      ...initialParams,
      ordering,
      search: debouncedSearch,
      // todo: add other filters
      packaging: undefined,
      price: undefined,
      volume: undefined,
      purchased_at: undefined,
    };
  }, [debouncedSearch, ordering]);

  const {
    data: dataPurchases,
    isLoading: isLoadingPurchases,
    hasNextPage: hasNextPagePurchases,
    fetchNextPage: fetchNextPagePurchases,
  } = usePurchasesQuery({
    initialData,
    staleTime: 10 * 1000,
    params: purchasesParams,
  });

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

  const createMutation = usePurchaseCreateMutation({
    onSuccess: () => {
      notifications.show({
        title: "Success!",
        message: "Purchase has been added",
        color: "green",
      });
      addModalHandlers.close();
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
            <PurchasesTable
              data={purchases}
              sorting={sorting}
              onSortingChange={onSortingChange}
            />
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
