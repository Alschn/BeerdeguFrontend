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
import type { Hop, PaginatedResponseData } from "~/api/types";
import HopsTable from "./HopsTable";
import { type HopsParams, getHops } from "~/api/hops";
import { type ChangeEvent, useMemo, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNextPageParam } from "~/utils/tanstack-query";

interface HopsPageProps {
  initialData: PaginatedResponseData<Hop>;
}

const PAGE_SIZES = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

export default function HopsPage({ initialData }: HopsPageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filters = {
    page: page,
    page_size: pageSize,
    name__icontains: debouncedSearch,
  } satisfies HopsParams;

  const { isLoading: isLoadingHops, data: dataHops } = useInfiniteQuery({
    queryKey: ["hops", filters] as const,
    queryFn: async ({ queryKey }) => {
      const res = await getHops(queryKey[1]);
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
    if (!dataHops) return initialData.results;
    return dataHops.pages.flatMap((page) => page.results) || [];
  }, [dataHops, initialData.results]);

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

  const handleAddHop = () => {
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
          onClick={handleAddHop}
          disabled
          id="hop-add-button"
        >
          Add hop
        </Button>
      </Flex>
      <Divider my="sm" />
      <Box sx={{ overflow: "hidden" }} id="breweries-table-container">
        <HopsTable data={results} isLoading={isLoadingHops} />
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
