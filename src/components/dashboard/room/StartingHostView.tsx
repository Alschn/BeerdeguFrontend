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
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrashX } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type ChangeEvent, useMemo, useState } from "react";
import { getBeers } from "~/api/beers";
import { addBeerToRoom, removeBeerFromRoom } from "~/api/rooms";
import type { Beer, BeerObject } from "~/api/types";
import { useRoom } from "~/components/context/room";
import { getNextPageParam } from "~/utils/tanstack-query";

export function BeerCard({ beer }: { beer: Beer }) {
  const { beers, sendJsonMessage, roomName } = useRoom();
  const isInRoom = beers.some((b) => b.id === beer.id);

  const handleAddBeer = () => {
    addBeerToRoom(roomName, beer.id)
      .then(() => {
        notifications.show({
          title: "Beer added",
          message: `Beer '${beer.name}' has been added to the room`,
          color: "green",
        });
        sendJsonMessage({
          command: "load_beers",
        });
      })
      .catch(() => {
        notifications.show({
          title: "Error",
          message: `Beer '${beer.name}' could not be added to the room`,
          color: "red",
        });
      });
  };

  return (
    <Card withBorder h="100%">
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

      {!isInRoom && (
        <Tooltip label="Add beer" position="bottom">
          <Button onClick={handleAddBeer}>Add</Button>
        </Tooltip>
      )}
    </Card>
  );
}

export function BeerCardListItem({
  beer,
  onRemove,
}: {
  beer: BeerObject;
  onRemove: (beerId: number) => void;
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
          <ActionIcon onClick={() => onRemove(beer.id)} color="red">
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
    // todo: infinite scroll
    // hasNextPage: hasNextPageBeers,
    // fetchNextPage: fetchNextPageBeers,
  } = useInfiniteQuery({
    queryKey: ["beers", debouncedSearch],
    queryFn: ({ pageParam = 1, queryKey }) => {
      return getBeers({
        page: pageParam as number,
        search: queryKey[1] as string,
      });
    },
    getNextPageParam: getNextPageParam,
    refetchOnWindowFocus: false,
  });

  const results = useMemo(() => {
    if (!beersData || !beersData.pages) return [];
    return beersData.pages.flatMap((page) => page.data.results);
  }, [beersData]);

  const handleRemoveBeer = (id: number) => {
    removeBeerFromRoom(roomName, id)
      .then(() => {
        notifications.show({
          title: "Success",
          message: "Beer removed from room",
          color: "green",
        });
        sendJsonMessage({
          command: "load_beers",
        });
      })
      .catch(() => {
        notifications.show({
          title: "Error",
          message: "Could not remove beer from room",
          color: "red",
        });
      });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  // todo: infinite scroll

  return (
    <Grid>
      <Grid.Col xs={12} lg={8} orderXs={2} orderMd={1}>
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
          <Grid>
            {results.map((beer) => (
              <Grid.Col key={`beer-col-${beer.id}`} xs={6} md={4} xl={3}>
                <BeerCard beer={beer} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Grid.Col>

      <Grid.Col xs={12} lg={4} orderMd={2}>
        <Title order={2} align="center" mb={16}>
          {"Beers in room:"}
        </Title>

        <SimpleGrid>
          {beers.map((beer) => (
            <BeerCardListItem
              beer={beer}
              onRemove={handleRemoveBeer}
              key={`beer-in-room-${beer.id}`}
            />
          ))}
        </SimpleGrid>
      </Grid.Col>
    </Grid>
  );
}
