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
import type { Hop, PaginatedResponseData } from "~/api/types";
import { useHops } from "~/hooks/api/hops";
import HopsTable from "./HopsTable";

const PAGE_SIZES = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

const QUERY_STALE_TIME = 60 * 1000;

interface HopsPageProps {
  initialData: PaginatedResponseData<Hop>;
}

export default function HopsPage({ initialData }: HopsPageProps) {
  const initialDataUpdateAtRef = useRef(
    new Date().getTime() - QUERY_STALE_TIME
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const { isLoading: isLoadingHops, data: dataHops } = useHops({
    params: {
      page: page,
      page_size: pageSize,
      name__icontains: debouncedSearch,
    },
    staleTime: QUERY_STALE_TIME,
    initialData: initialData,
    initialDataUpdatedAt: initialDataUpdateAtRef.current,
  });

  const results = useMemo(() => {
    if (!dataHops) return initialData.results;
    return dataHops.pages.flatMap((page) => page.results);
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
