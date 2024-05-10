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
import { useInfiniteQuery } from "@tanstack/react-query";
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

  const [_isAddModalOpen, addModalHandlers] = useDisclosure(false);

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

  // todo: add filters inputs, multistep modal

  return (
    <Box>
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
              disabled
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
