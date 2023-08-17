import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Grid,
  Group,
  SimpleGrid,
  TextInput,
  Title,
  Tooltip,
  Text,
  Image,
  Center,
  Divider,
  Button,
  Stack,
  Badge,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconInfoCircleFilled, IconTrashX } from "@tabler/icons-react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { type ChangeEvent, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getBeers } from "~/api/beers";
import { addBeerToRoom, removeBeerFromRoom } from "~/api/rooms";
import type { Beer, BeerObject } from "~/api/types";
import { useRoom } from "~/components/context/room";
import { getNextPageParam } from "~/utils/tanstack-query";

export const BeerDetailsModalBody = ({ beer }: { beer: Beer }) => {
  return (
    <Stack spacing={8}>
      <Center>
        <Image
          src={beer?.image}
          width={200}
          height={200}
          fit="contain"
          alt={beer.name}
          withPlaceholder
        />
      </Center>
      <Stack spacing={4}>
        <Box>
          <Text display="inline-block" weight={600}>
            Name:
          </Text>{" "}
          <Text display="inline-block">{beer.name}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Brewery:
          </Text>{" "}
          <Text display="inline-block">{beer.brewery?.name || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Style:
          </Text>{" "}
          <Text display="inline-block">{beer.style?.name || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            ABV [%]:
          </Text>{" "}
          <Text display="inline-block">{beer.percentage}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Extract [°BLG]:
          </Text>{" "}
          <Text display="inline-block">{beer.extract || "-"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Bitterness [IBU]:
          </Text>{" "}
          <Text display="inline-block">{beer.IBU || "-"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Hoprate [g/L]:
          </Text>{" "}
          <Text display="inline-block">{beer.hop_rate || "-"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Hops:
          </Text>{" "}
          <Box display="inline">
            {beer.hops.map((hop) => (
              <Badge key={`badge-hop-${hop.id}1`} mr={4}>
                {hop.name}
              </Badge>
            ))}
          </Box>
        </Box>
      </Stack>
      <Text>{beer.description}</Text>
    </Stack>
  );
};

export function BeerCard({ beer }: { beer: Beer }) {
  const { beers, sendJsonMessage, roomName } = useRoom();
  const isInRoom = beers.some((b) => b.id === beer.id);

  const beerAddMutation = useMutation({
    mutationFn: () => addBeerToRoom(roomName, beer.id),
    onSuccess: () => {
      notifications.show({
        title: "Beer added",
        message: `Beer '${beer.name}' has been added to the room`,
        color: "green",
      });
      sendJsonMessage({
        command: "load_beers",
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: `Beer '${beer.name}' could not be added to the room`,
        color: "red",
      });
    },
  });

  const handleAddBeer = () => {
    beerAddMutation.mutate();
    beerAddMutation.reset();
  };

  const openModal = () => {
    modals.open({
      title: (
        <Text size="lg" weight={600}>
          {beer.name}
        </Text>
      ),
      children: <BeerDetailsModalBody beer={beer} />,
      centered: true,
    });
  };

  return (
    <Card withBorder shadow="xs" h="100%">
      <Card.Section p={16}>
        <Center>
          <Image
            src={beer.image}
            alt={beer.name}
            withPlaceholder
            width={128}
            height={128}
            fit="contain"
          />
        </Center>
        <Text size="lg" weight={600}>
          {beer.name}
        </Text>
        <Text size="md">{beer.brewery.name}</Text>
      </Card.Section>

      <Divider mb={16} />

      <Group position={isInRoom ? "right" : "apart"} align="center">
        {!isInRoom && (
          <Tooltip label="Click to add beer" position="bottom">
            <Button
              onClick={handleAddBeer}
              disabled={beerAddMutation.isSuccess}
              loading={beerAddMutation.isLoading}
            >
              Add
            </Button>
          </Tooltip>
        )}
        <Tooltip label="More information">
          <ActionIcon onClick={openModal}>
            <IconInfoCircleFilled />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Card>
  );
}

export function BeerCardListItem({
  beer,
  onRemove,
  isRemoving,
}: {
  beer: BeerObject;
  onRemove: (beerId: number) => void;
  isRemoving: boolean;
}) {
  return (
    <Card
      withBorder
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      key={`beer-in-room-${beer.id}`}
    >
      <Group spacing={16} align="center">
        <Image
          height={64}
          width={64}
          fit="contain"
          src={beer.image}
          alt={beer.name}
          withPlaceholder
        />
        <Box>
          <Text size="lg" weight={600}>
            {beer.name}
          </Text>
          <Text size="md">{beer.brewery}</Text>
        </Box>
      </Group>
      <Flex align="center">
        <Tooltip label="Remove beer" position="bottom">
          <ActionIcon
            onClick={() => onRemove(beer.id)}
            color="red"
            loading={isRemoving}
          >
            <IconTrashX />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Card>
  );
}

export default function HostView() {
  const { beers, roomName, sendJsonMessage } = useRoom();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const {
    isFetching: isFetchingBeers,
    data: beersData,
    hasNextPage: hasNextPageBeers,
    fetchNextPage: fetchNextPageBeers,
  } = useInfiniteQuery({
    queryKey: ["beers", { search: debouncedSearch }] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const res = await getBeers({
        page: pageParam as number,
        ...queryKey[1],
      });
      return res.data;
    },
    getNextPageParam: getNextPageParam,
    refetchOnWindowFocus: false,
  });

  const results = useMemo(() => {
    if (!beersData || !beersData.pages) return [];
    return beersData.pages.flatMap((page) => page.results);
  }, [beersData]);

  const beerRemoveMutation = useMutation({
    mutationFn: (beerId: number) => removeBeerFromRoom(roomName, beerId),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Beer removed from room",
        color: "green",
      });
      sendJsonMessage({
        command: "load_beers",
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Could not remove beer from room",
        color: "red",
      });
    },
  });

  const handleRemoveBeer = (id: number) => {
    beerRemoveMutation.mutate(id);
    beerRemoveMutation.reset();
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleFetchMoreBeers = async () => {
    if (!hasNextPageBeers) return;
    await fetchNextPageBeers();
  };

  return (
    <Grid>
      <Grid.Col xs={12} lg={8} order={2} orderMd={1}>
        <Title order={2} align="center" mb={16}>
          {"Search beers:"}
        </Title>

        <TextInput
          placeholder="Search beers..."
          value={search}
          onChange={handleSearchChange}
          mb={16}
        />

        {isFetchingBeers ? (
          <p>{"Fetching beers..."}</p>
        ) : (
          <InfiniteScroll
            next={handleFetchMoreBeers}
            hasMore={Boolean(hasNextPageBeers)}
            loader={<></>}
            dataLength={results.length}
            scrollThreshold={0.95}
            style={{ overflow: "hidden" }}
          >
            <Grid>
              {results.map((beer) => (
                <Grid.Col key={`beer-col-${beer.id}`} xs={6} md={4} xl={3}>
                  <BeerCard beer={beer} />
                </Grid.Col>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Grid.Col>

      <Grid.Col xs={12} lg={4} order={1} orderMd={2}>
        <Title order={2} align="center" mb={16}>
          {"Beers in room:"}
        </Title>

        <SimpleGrid>
          {beers.map((beer) => (
            <BeerCardListItem
              beer={beer}
              isRemoving={beerRemoveMutation.isLoading}
              onRemove={handleRemoveBeer}
              key={`beer-in-room-${beer.id}`}
            />
          ))}
        </SimpleGrid>
      </Grid.Col>
    </Grid>
  );
}
