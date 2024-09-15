"use client";

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
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { type ChangeEvent, useMemo, useRef, useState } from "react";
import type { Brewery, PaginatedResponseData } from "~/api/types";
import { useBreweries } from "~/hooks/api/breweries";
import BreweriesTable from "./BreweriesTable";

const PAGE_SIZES = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

const QUERY_STALE_TIME = 60 * 1000;

interface BreweriesPageProps {
  initialData: PaginatedResponseData<Brewery>;
}

export default function BreweriesPage({ initialData }: BreweriesPageProps) {
  const initialDataUpdateAtRef = useRef(
    new Date().getTime() - QUERY_STALE_TIME
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const { isLoading: isLoadingBreweries, data: dataBreweries } = useBreweries({
    params: {
      page: page,
      page_size: pageSize,
      search: debouncedSearch,
    },
    staleTime: QUERY_STALE_TIME,
    initialData: initialData,
    initialDataUpdatedAt: initialDataUpdateAtRef.current,
  });

  const results = useMemo(() => {
    if (!dataBreweries) return initialData.results;
    return dataBreweries.pages.flatMap((page) => page.results);
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
