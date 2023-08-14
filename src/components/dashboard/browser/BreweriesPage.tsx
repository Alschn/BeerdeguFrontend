"use client";

import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Pagination,
  Paper,
  Select,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type ChangeEvent, useMemo, useState } from "react";
import { type BreweriesParams, getBreweries } from "~/api/breweries";
import type { PaginatedResponseData, Brewery } from "~/api/types";
import { getNextPageParam } from "~/utils/tanstack-query";
import BreweriesTable from "./BreweriesTable";

interface BreweriesPageProps {
  initialData: PaginatedResponseData<Brewery>;
}

const PAGE_SIZES = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

export default function BreweriesPage({ initialData }: BreweriesPageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filters = {
    page: page,
    page_size: pageSize,
    search: debouncedSearch,
  } satisfies BreweriesParams;

  const { isLoading: isLoadingBreweries, data: dataBreweries } =
    useInfiniteQuery({
      queryKey: ["breweries", filters] as const,
      queryFn: async ({ queryKey }) => {
        const res = await getBreweries(queryKey[1]);
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
    if (!dataBreweries) return initialData.results;
    return dataBreweries.pages.flatMap((page) => page.results) || [];
  }, [dataBreweries, initialData.results]);

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

  const handleAddBrewery = () => {
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
          onClick={handleAddBrewery}
          disabled
          id="brewery-add-button"
        >
          Add brewery
        </Button>
      </Flex>
      <Divider my="sm" />
      <Box sx={{ overflow: "hidden" }} id="breweries-table-container">
        <BreweriesTable data={results} isLoading={isLoadingBreweries} />
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
