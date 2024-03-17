"use client";

import { Button, Center, Flex, Loader } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { BeerPurchase, PaginatedResponseData } from "~/api/types";
import { getPurchases } from "~/app/dashboard/(general)/purchases/actions";
import { getNextPageParam } from "~/utils/tanstack-query";

interface PurchasesPageProps {
  initialData: PaginatedResponseData<BeerPurchase>;
}

export default function PurchasesPage({ initialData }: PurchasesPageProps) {
  const purchasesParams = {
    page_size: 10,
  } as const;

  const {
    data: dataPurchases,
    isLoading: isLoadingPurchases,
    hasNextPage: hasNextPagePurchases,
    fetchNextPage: fetchNextPagePurchases,
  } = useInfiniteQuery({
    queryKey: ["purchases", purchasesParams] as const,
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

  const purchases = useMemo(() => {
    return dataPurchases?.pages.flatMap((page) => page.results) || [];
  }, [dataPurchases]);

  const handleFetchNextPage = async () => {
    if (!hasNextPagePurchases) return;
    await fetchNextPagePurchases();
  };

  // todo: layout, displaying purchases, add purchases multistep modal

  return (
    <div>
      <Button leftIcon={<IconPlus size="1rem" />}>Add purchase</Button>

      <InfiniteScroll
        dataLength={purchases.length}
        next={handleFetchNextPage}
        hasMore={Boolean(hasNextPagePurchases)}
        loader={
          <Center mt={16}>
            <Loader />
          </Center>
        }
        scrollThreshold={0.95}
        scrollableTarget="purchases-container"
      >
        <Flex direction="column" gap={16} mb={16} id="purchases-container">
          <pre>{JSON.stringify(purchases, null, 2)}</pre>
        </Flex>
      </InfiniteScroll>
      {isLoadingPurchases && (
        <Center py="lg">
          <Loader size="lg" />
        </Center>
      )}
    </div>
  );
}
