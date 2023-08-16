"use client";

import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Loader,
  MultiSelect,
  RangeSlider,
  Text,
  TextInput
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo, useState, type ChangeEvent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getBeerStyles, type BeerStylesParams } from "~/api/beer_styles";
import {
  createBeer,
  getBeers,
  type BeerCreatePayload,
  type BeersParams,
} from "~/api/beers";
import { getBreweries, type BreweriesParams } from "~/api/breweries";
import { getHops, type HopsParams } from "~/api/hops";
import type { Beer, PaginatedResponseData } from "~/api/types";
import { getNextPageParam } from "~/utils/tanstack-query";
import BeerAddModal from "./BeerAddModal";
import BeerCard from "./BeerCard";

interface BeersPageProps {
  initialData: PaginatedResponseData<Beer>;
}

const BEERS_PAGE_SIZE = 24;

// initialData, initialDataUpdatedAt interactions
// https://tanstack.com/query/latest/docs/react/guides/initial-query-data

export default function BeersPage({ initialData }: BeersPageProps) {
  const [search, setSearch] = useState("");
  const [breweriesSearch, setBreweriesSearch] = useState("");
  const [beerStylesSearch, setBeerStylesSearch] = useState("");
  const [hopsSearch, setHopsSearch] = useState("");

  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [debouncedBreweriesSearch] = useDebouncedValue(breweriesSearch, 500);
  const [debouncedBeerStylesSearch] = useDebouncedValue(beerStylesSearch, 500);
  const [debouncedHopsSearch] = useDebouncedValue(hopsSearch, 500);

  const [breweriesIds, setBreweriesIds] = useState<string[]>([]);
  const [hopsIds, setHopsIds] = useState<string[]>([]);
  const [stylesIds, setStylesIds] = useState<string[]>([]);
  const [volumeRange, setVolumeRange] = useState<[number, number]>([1, 1000]);
  const [percentageRange, setPercentageRange] = useState<[number, number]>([
    0, 40,
  ]);

  const [isAddModalOpen, addModalHandlers] = useDisclosure(false);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const { isLoading: isLoadingBreweries, data: dataBreweries } = useQuery({
    queryKey: [
      "breweries",
      {
        search: debouncedBreweriesSearch,
        page_size: 25,
      } satisfies BreweriesParams,
    ] as const,
    queryFn: async ({ queryKey }) => {
      const res = await getBreweries({ ...queryKey[1] });
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { isLoading: isLoadingBeerStyles, data: dataBeerStyles } = useQuery({
    queryKey: [
      "beer_styles",
      {
        name__icontains: debouncedBeerStylesSearch,
        page_size: 25,
      } satisfies BeerStylesParams,
    ] as const,
    queryFn: async ({ queryKey }) => {
      const res = await getBeerStyles({ ...queryKey[1] });
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { isLoading: isLoadingHops, data: dataHops } = useQuery({
    queryKey: [
      "hops",
      {
        name__icontains: debouncedHopsSearch,
        page_size: 25,
      } satisfies HopsParams,
    ] as const,
    queryFn: async ({ queryKey }) => {
      const res = await getHops({ ...queryKey[1] });
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const breweriesOptions = useMemo(() => {
    return (
      dataBreweries?.results.map((brewery) => ({
        value: String(brewery.id),
        label: brewery.name,
      })) || []
    );
  }, [dataBreweries]);

  const beerStylesOptions = useMemo(() => {
    return (
      dataBeerStyles?.results.map((style) => ({
        value: String(style.id),
        label: style.name,
      })) || []
    );
  }, [dataBeerStyles]);

  const hopsOptions = useMemo(() => {
    return (
      dataHops?.results.map((hop) => ({
        value: String(hop.id),
        label: hop.name,
      })) || []
    );
  }, [dataHops]);

  const filters = {
    brewery__in: breweriesIds.join(","),
    style__in: stylesIds.join(","),
    hops__in: hopsIds.join(","),
    percentage__range: percentageRange.join(","),
    volume_ml__range: volumeRange.join(","),
    search: debouncedSearch,
    page_size: BEERS_PAGE_SIZE,
  } satisfies BeersParams;

  const {
    hasNextPage: hasNextPageBeers,
    fetchNextPage: fetchNextPageBeers,
    data: dataBeers,
  } = useInfiniteQuery({
    queryKey: ["beers", filters] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const res = await getBeers({
        page: pageParam as number,
        ...queryKey[1],
      });
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

  const results = useMemo(() => {
    if (!dataBeers) return initialData.results;
    return dataBeers.pages.flatMap((page) => page.results) || [];
  }, [dataBeers, initialData.results]);

  const handleFetchMoreBeers = async () => {
    if (!hasNextPageBeers) return;
    await fetchNextPageBeers();
  };

  // todo: only let admins (or other priviliged users) add beers

  const client = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: BeerCreatePayload) => createBeer(data),
    onSuccess: async () => {
      notifications.show({
        title: "Beer created",
        message: "Beer was successfully created",
        color: "green",
      });
      await client.invalidateQueries(["beers"]);
      addModalHandlers.close();
    },
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        notifications.show({
          title: "Something went wrong!",
          message: "Try again later...",
          color: "red",
        });
        return;
      }
      notifications.show({
        title: "Failed to add beer",
        message: "Make sure that provided data is correct",
        color: "red",
      });
    },
  });

  const handleAddBeer = (data: BeerCreatePayload) => {
    addMutation.mutate(data);
  };

  return (
    <>
      <BeerAddModal
        opened={isAddModalOpen}
        onClose={addModalHandlers.close}
        onSubmit={handleAddBeer}
        isLoading={addMutation.isLoading}
      />
      <Card mt="sm">
        <Group position="apart" align="start">
          <MultiSelect
            data={breweriesOptions}
            value={breweriesIds}
            onChange={setBreweriesIds}
            searchValue={breweriesSearch}
            onSearchChange={setBreweriesSearch}
            label="Breweries"
            placeholder="Select breweries"
            nothingFound="No breweries found"
            limit={30}
            maxDropdownHeight={200}
            w={{ base: 200, lg: 300 }}
            dropdownPosition="bottom"
            disabled={isLoadingBreweries}
            searchable
            clearable
            withinPortal
          />
          <MultiSelect
            data={beerStylesOptions}
            value={stylesIds}
            onChange={setStylesIds}
            searchValue={beerStylesSearch}
            onSearchChange={setBeerStylesSearch}
            label="Beer styles"
            placeholder="Select beer styles"
            nothingFound="No beer styles found"
            limit={30}
            maxDropdownHeight={200}
            dropdownPosition="bottom"
            w={{ base: 200, lg: 300 }}
            disabled={isLoadingBeerStyles}
            searchable
            clearable
            withinPortal
          />
          <MultiSelect
            data={hopsOptions}
            value={hopsIds}
            onChange={setHopsIds}
            searchValue={hopsSearch}
            onSearchChange={setHopsSearch}
            label="Hops"
            placeholder="Select hops"
            nothingFound="No hops found"
            limit={30}
            maxDropdownHeight={200}
            dropdownPosition="bottom"
            w={{ base: 200, lg: 300 }}
            disabled={isLoadingHops}
            searchable
            clearable
            withinPortal
          />
          <Box w={{ base: 200, lg: 240 }} px={{ base: 8, lg: 16 }}>
            <Text
              size="sm"
              weight={600}
              ml={-8}
              component="label"
              id="percentage-range-slider-label"
            >
              Percentage [%]
            </Text>
            <RangeSlider
              label={(value) => `${value.toFixed(1)}%`}
              step={0.1}
              min={0}
              max={40}
              marks={[
                { value: 0, label: "0%" },
                { value: 10, label: "10%" },
                { value: 20, label: "20%" },
                { value: 30, label: "30%" },
                { value: 40, label: "40%" },
              ]}
              minRange={0}
              value={percentageRange}
              onChangeEnd={(values) => {
                const newValues = values.map((v) => Number(v.toFixed(1))) as [
                  number,
                  number
                ];
                setPercentageRange(newValues);
              }}
              id="percentage-range-slider"
              aria-labelledby="percentage-range-slider-label"
            />
          </Box>
          <Box w={{ base: 200, lg: 240 }} px={{ base: 8, lg: 16 }}>
            <Text
              size="sm"
              weight={600}
              ml={-8}
              component="label"
              id="volume_ml-range-slider-label"
            >
              Volume [ml]
            </Text>
            <RangeSlider
              label={(value) => `${value}ml`}
              step={1}
              min={1}
              max={1000}
              marks={[
                { value: 1, label: "1ml" },
                { value: 500, label: "500ml" },
                { value: 1000, label: "1000ml" },
              ]}
              minRange={0}
              value={volumeRange}
              onChangeEnd={setVolumeRange}
              id="volume_ml-range-slider"
              aria-labelledby="volume_ml-range-slider-label"
            />
          </Box>
          <Flex sx={{ flexGrow: 0.9 }}></Flex>
          <TextInput
            name="search"
            label="Search"
            placeholder="Search..."
            value={search}
            onChange={handleChangeSearch}
            w={{ base: 200, lg: 300 }}
            icon={<IconSearch size="1rem" />}
          />
        </Group>
        <Flex justify="end" mt={16}>
          <Button
            leftIcon={<IconPlus size="1rem" />}
            onClick={addModalHandlers.open}
            id="beer-add-button"
          >
            Add beer
          </Button>
        </Flex>
      </Card>
      <InfiniteScroll
        dataLength={results.length}
        next={handleFetchMoreBeers}
        hasMore={Boolean(hasNextPageBeers)}
        loader={
          <Center mt={16}>
            <Loader />
          </Center>
        }
        scrollThreshold={0.9}
        scrollableTarget="root"
        style={{ overflow: "hidden" }}
      >
        <Grid mt="xs">
          {results.map((beer) => (
            <Grid.Col
              span={12}
              sm={6}
              lg={4}
              xl={3}
              key={`beers-beer-${beer.id}`}
            >
              <BeerCard beer={beer} />
            </Grid.Col>
          ))}
        </Grid>
      </InfiniteScroll>
    </>
  );
}
