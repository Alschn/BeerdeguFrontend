"use client";

import {
  Box,
  Card,
  CardSection,
  Grid,
  Image,
  Text,
  createStyles,
  TextInput,
  Group,
  Divider,
  RangeSlider,
  MultiSelect,
  Flex,
  Button,
  Center,
  Loader,
} from "@mantine/core";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { type ChangeEvent, useState, useMemo } from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { type BeersParams, getBeers } from "~/api/beers";
import type { Beer, PaginatedResponseData } from "~/api/types";
import { useDebouncedValue } from "@mantine/hooks";
import { getNextPageParam } from "~/utils/tanstack-query";
import { getBreweries } from "~/api/breweries";
import { getBeerStyles } from "~/api/beer_styles";
import { getHops } from "~/api/hops";
import InfiniteScroll from "react-infinite-scroll-component";

interface BeersPageProps {
  initialData: PaginatedResponseData<Beer>;
}

const BEERS_PAGE_SIZE = 24;

// initialData, initialDataUpdatedAt interactions
// https://tanstack.com/query/latest/docs/react/guides/initial-query-data

export default function BeersPage({ initialData }: BeersPageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [breweriesIds, setBreweriesIds] = useState<string[]>([]);
  const [hopsIds, setHopsIds] = useState<string[]>([]);
  const [stylesIds, setStylesIds] = useState<string[]>([]);
  const [volumeRange, setVolumeRange] = useState<[number, number]>([1, 1000]);
  const [percentageRange, setPercentageRange] = useState<[number, number]>([
    0, 40,
  ]);

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const { isLoading: isLoadingBreweries, data: dataBreweries } = useQuery({
    queryKey: ["breweries", { page_size: 50 }] as const,
    queryFn: ({ queryKey }) => getBreweries({ ...queryKey[1] }),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { isLoading: isLoadingBeerStyles, data: dataBeerStyles } = useQuery({
    queryKey: ["beer_styles", { page_size: 50 }] as const,
    queryFn: ({ queryKey }) => getBeerStyles({ ...queryKey[1] }),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { isLoading: isLoadingHops, data: dataHops } = useQuery({
    queryKey: ["hops", { page_size: 50 }] as const,
    queryFn: ({ queryKey }) => getHops({ ...queryKey[1] }),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

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

  const handleAddBeer = () => {
    // todo: open modal with a form, create mutation
  };

  return (
    <>
      <Card mt="sm">
        <Group position="apart" align="start">
          <MultiSelect
            data={
              dataBreweries?.data?.results.map((b) => ({
                value: String(b.id),
                label: b.name,
              })) || []
            }
            onChange={setBreweriesIds}
            label="Breweries"
            placeholder="Select breweries"
            nothingFound="No breweries found"
            w={{ base: 200, lg: 300 }}
            maxDropdownHeight={200}
            dropdownPosition="bottom"
            limit={30}
            disabled={isLoadingBreweries}
            searchable
            clearable
            withinPortal
          />
          <MultiSelect
            data={
              dataBeerStyles?.data?.results.map((b) => ({
                value: String(b.id),
                label: b.name,
              })) || []
            }
            onChange={setStylesIds}
            label="Beer styles"
            placeholder="Select beer styles"
            nothingFound="No beer styles found"
            w={{ base: 200, lg: 300 }}
            maxDropdownHeight={200}
            dropdownPosition="bottom"
            limit={30}
            disabled={isLoadingBeerStyles}
            searchable
            clearable
            withinPortal
          />
          <MultiSelect
            data={
              dataHops?.data?.results.map((b) => ({
                value: String(b.id),
                label: b.name,
              })) || []
            }
            onChange={setHopsIds}
            label="Hops"
            placeholder="Select hops"
            nothingFound="No hops found"
            w={{ base: 200, lg: 300 }}
            maxDropdownHeight={200}
            dropdownPosition="bottom"
            limit={30}
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
            onClick={handleAddBeer}
            disabled
            id="beer-add-button"
          >
            Add beer
          </Button>
        </Flex>
      </Card>
      <InfiniteScroll
        dataLength={initialData.count}
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

const useStyles = createStyles((theme) => ({
  card: {
    height: "100%",
    cursor: "pointer",
    transition: "box-shadow 50ms ease",

    "&:hover": {
      boxShadow: theme.shadows.sm,
    },
  },
}));

function BeerCard({ beer }: { beer: Beer }) {
  const { classes } = useStyles();

  return (
    <Card
      className={classes.card}
      component="article"
      id={`beer-${beer.id}-card`}
    >
      <CardSection p="lg" component="header">
        <Image
          src={beer.image}
          alt={beer.name}
          height={200}
          fit="contain"
          withPlaceholder
        />
      </CardSection>
      <Box component="section">
        <Text size="lg" fw={600} align="center">
          {beer.name}
        </Text>
        <Text size="md" align="center">
          {beer.style?.name}
        </Text>
        <Text align="center">{beer.brewery.name}</Text>
        <Group position="center">
          <Text size="sm">{beer.percentage}%</Text>
          <Divider orientation="vertical" />
          <Text size="sm">{beer.volume_ml}ml</Text>
        </Group>
      </Box>
    </Card>
  );
}
