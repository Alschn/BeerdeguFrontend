"use client";

import type { BeerStyle, PaginatedResponseData } from "~/api/types";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Pagination,
  Select,
  TextInput,
} from "@mantine/core";
import { type ChangeEvent, useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNextPageParam } from "~/utils/tanstack-query";
import BeerStylesTable from "./BeerStylesTable";
import { type BeerStylesParams, getBeerStyles } from "~/api/beer_styles";

interface BeerStylesPageProps {
  initialData: PaginatedResponseData<BeerStyle>;
}

const PAGE_SIZES = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

export default function BeerStylesPage({ initialData }: BeerStylesPageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filters = {
    page: page,
    page_size: pageSize,
    name__icontains: debouncedSearch,
  } satisfies BeerStylesParams;

  const { isLoading: isLoadingBeerStyles, data: dataBeerStyles } =
    useInfiniteQuery({
      queryKey: ["beer_styles", filters] as const,
      queryFn: async ({ queryKey }) => {
        const res = await getBeerStyles(queryKey[1]);
        return res.data;
      },
      staleTime: 60 * 1000,
      getNextPageParam: getNextPageParam,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
      initialDataUpdatedAt: new Date().getTime() - 60 * 1000,
    });

  const results = useMemo(() => {
    if (!dataBeerStyles) return initialData.results;
    return dataBeerStyles.pages.flatMap((page) => page.results) || [];
  }, [dataBeerStyles, initialData.results]);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setPage(1);
  };

  const handleChangePageSize = (value: string) => {
    setPageSize(Number(value));
  };

  const handleChangePage = (value: number) => {
    setPage(value);
  };

  const pagesCount = Math.ceil(initialData.count / pageSize);

  const handleAddBeerStyle = () => {
    // todo: modal, mutation
  };

  return (
    <Card mt="sm">
      <Group position="apart">
        <TextInput
          name="search"
          label="Search"
          placeholder="Search..."
          value={search}
          onChange={handleChangeSearch}
          w={{ base: 200, lg: 300 }}
          icon={<IconSearch size="1rem" />}
        />
        <Select
          name="pageSize"
          label="Page size"
          data={PAGE_SIZES}
          value={String(pageSize)}
          onChange={handleChangePageSize}
          maw={{ base: 100 }}
        />
      </Group>
      <Flex justify="end" align="center" mt="sm" sx={{ width: "100%" }}>
        <Button
          leftIcon={<IconPlus size="1rem" />}
          onClick={handleAddBeerStyle}
          disabled
          id="beer_style-add-button"
        >
          Add beer style
        </Button>
      </Flex>
      <Divider my="sm" />
      <Box sx={{ overflow: "hidden" }} id="breweries-table-container">
        <BeerStylesTable data={results} isLoading={isLoadingBeerStyles} />
      </Box>
      <Divider />
      <Flex p={8} justify="end" align="center" sx={{ width: "100%" }}>
        <Pagination
          value={page}
          onChange={handleChangePage}
          total={pagesCount}
        />
      </Flex>
    </Card>
  );
}
