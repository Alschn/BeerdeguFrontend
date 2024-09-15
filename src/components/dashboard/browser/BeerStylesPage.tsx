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
import type { BeerStyle, PaginatedResponseData } from "~/api/types";
import { useBeerStyles } from "~/hooks/api/beer_styles";
import BeerStylesTable from "./BeerStylesTable";

const PAGE_SIZES = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

const QUERY_STALE_TIME = 60 * 1000;

interface BeerStylesPageProps {
  initialData: PaginatedResponseData<BeerStyle>;
}

export default function BeerStylesPage({ initialData }: BeerStylesPageProps) {
  const initialDataUpdateAtRef = useRef(
    new Date().getTime() - QUERY_STALE_TIME
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const { isLoading: isLoadingBeerStyles, data: dataBeerStyles } =
    useBeerStyles({
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
    if (!dataBeerStyles) return initialData.results;
    return dataBeerStyles.pages.flatMap((page) => page.results) || [];
  }, [dataBeerStyles, initialData.results]);

  // const [isAddModalOpen, addModalHandlers] = useDisclosure(false);

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

  // const client = useQueryClient();

  // const addMutation = useMutation({
  //   mutationFn: async () => {
  //     //
  //   },
  //   onSuccess: async () => {
  //     notifications.show({
  //       title: "Beer style created",
  //       message: "Beer style was successfully created",
  //       color: "green",
  //     });
  //     await client.invalidateQueries(["beer_styles"]);
  //     addModalHandlers.close();
  //   },
  //   onError: (error) => {
  //     if (!isApiError(error)) {
  //       notifications.show({
  //         title: "Something went wrong!",
  //         message: "Try again later...",
  //         color: "red",
  //       });
  //       return;
  //     }

  //     const _err = APIError.fromAxiosError(error);
  //     // todo: handle error messsages
  //     notifications.show({
  //       title: "Failed to add beer style",
  //       message: "Make sure that provided data is correct",
  //       color: "red",
  //     });
  //   },
  // });

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
