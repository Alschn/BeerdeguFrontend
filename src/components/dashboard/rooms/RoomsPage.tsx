"use client";

import {
  Divider,
  Flex,
  Group,
  Pagination,
  Paper,
  Select,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useState, type FC, type ChangeEvent, useMemo } from "react";
import type { PaginatedResponseData, Room } from "~/api/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNextPageParam } from "~/utils/tanstack-query";
import { getRooms } from "~/api/rooms";
import RoomsTable from "../RoomsTable";
import { IconSearch } from "@tabler/icons-react";

interface RoomsPageProps {
  initialData: PaginatedResponseData<Room>;
}

const PAGE_SIZES = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

const RoomsPage: FC<RoomsPageProps> = ({ initialData }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const { isFetching: isFetchingRooms, data: dataRooms } = useInfiniteQuery({
    queryKey: [
      "rooms",
      { page: page, page_size: pageSize, name__icontains: debouncedSearch },
    ] as const,
    queryFn: async ({ queryKey }) => {
      const res = await getRooms({ ...queryKey[1] });
      return res.data;
    },
    staleTime: 30 * 1000,
    getNextPageParam: getNextPageParam,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
    initialDataUpdatedAt: new Date().getTime() - 30 * 1000,
  });

  const data = useMemo(() => {
    if (!dataRooms) return initialData.results;
    return dataRooms.pages.flatMap((page) => page.results) || [];
  }, [dataRooms, initialData.results]);

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

  // todo: loading state
  // todo: filtering by state, has_password
  // todo: disable query on mount

  return (
    <Paper p={4}>
      <Group p={4} position="apart">
        <TextInput
          name="search"
          label="Search"
          placeholder="Search..."
          value={search}
          onChange={handleChangeSearch}
          sx={{ minWidth: "300px" }}
          icon={<IconSearch size={"1rem"} />}
        />
        <Select
          name="pageSize"
          label="Page size"
          data={PAGE_SIZES}
          value={String(pageSize)}
          onChange={handleChangePageSize}
          sx={{ width: "100px" }}
        />
      </Group>
      <Divider mt={8} />
      <RoomsTable data={data} />
      <Divider />
      <Flex p={8} justify="end" align="center" sx={{ width: "100%" }}>
        <Pagination
          value={page}
          onChange={handleChangePage}
          total={pagesCount}
        />
      </Flex>
    </Paper>
  );
};

export default RoomsPage;
