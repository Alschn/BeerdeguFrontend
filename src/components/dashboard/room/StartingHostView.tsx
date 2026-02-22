import {
  DragDropContext,
  Draggable,
  Droppable,
  type OnDragEndResponder,
} from "@hello-pangea/dnd";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Image,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue, useListState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { addBeerToRoom, removeBeerFromRoom } from "~/api/rooms";
import type { Beer } from "~/api/types";
import { useRoom } from "~/components/context/room";
import { useWebsocketClient } from "~/components/context/websocket";
import { useBeers } from "~/hooks/api/beers";
import BeerCardListItem from "./BeerCardListItem";
import BeerDetailsModalBody from "./BeerDetailsModalBody";

interface AddBeerToRoomMutationPayload {
  roomName: string;
  beerId: number;
  order?: number;
}

interface UseAddBeerToRoomMutationOptions {
  onSuccess?: (
    data: Beer,
    variables: AddBeerToRoomMutationPayload,
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: AddBeerToRoomMutationPayload,
    context: unknown
  ) => void;
}

const useAddBeerToRoomMutation = (
  options?: UseAddBeerToRoomMutationOptions
) => {
  return useMutation({
    mutationFn: async ({
      roomName,
      beerId,
      order,
    }: AddBeerToRoomMutationPayload) => {
      const res = await addBeerToRoom(roomName, beerId, order);
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      if (variables.order === undefined) {
        notifications.show({
          title: "Beer added",
          message: `Beer '${data.name}' has been added to the room.`,
          color: "green",
        });
      }
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // todo: handle specific errors
      notifications.show({
        title: "Error",
        message: `Beer could not be added to the room.`,
        color: "red",
      });
      options?.onError?.(error, variables, context);
    },
  });
};

interface RemoveBeerFromRoomMutationPayload {
  roomName: string;
  beerId: number;
}

interface UseRemoveBeerFromRoomMutationOptions {
  onSuccess?: (
    data: unknown,
    variables: RemoveBeerFromRoomMutationPayload,
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: RemoveBeerFromRoomMutationPayload,
    context: unknown
  ) => void;
}

const useRemoveBeerFromRoomMutation = (
  options?: UseRemoveBeerFromRoomMutationOptions
) => {
  return useMutation({
    mutationFn: async ({
      roomName,
      beerId,
    }: RemoveBeerFromRoomMutationPayload) => {
      const res = await removeBeerFromRoom(roomName, beerId);
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      notifications.show({
        title: "Success",
        message: "Beer removed from room",
        color: "green",
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // todo: handle errors
      notifications.show({
        title: "Error",
        message: "Could not remove beer from room",
        color: "red",
      });
      options?.onError?.(error, variables, context);
    },
  });
};

export function BeerCard({ beer }: { beer: Beer }) {
  const { beers, roomName } = useRoom();
  const { sendJsonMessage } = useWebsocketClient();
  const isInRoom = beers.some((b) => b.id === beer.id);

  const beerAddMutation = useAddBeerToRoomMutation({
    onSuccess: () => {
      sendJsonMessage({
        command: "load_beers",
      });
    },
  });

  const handleAddBeer = () => {
    beerAddMutation.mutate({ beerId: beer.id, roomName });
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

export default function HostView() {
  const { beers, roomName } = useRoom();
  const { sendJsonMessage } = useWebsocketClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  const {
    isFetching: isFetchingBeers,
    data: beersData,
    hasNextPage: hasNextPageBeers,
    fetchNextPage: fetchNextPageBeers,
  } = useBeers({
    params: {
      search: debouncedSearch,
    },
    refetchOnWindowFocus: false,
  });

  const results = useMemo(() => {
    if (!beersData || !beersData.pages) return [];
    return beersData.pages.flatMap((page) => page.results);
  }, [beersData]);

  const beerRemoveMutation = useRemoveBeerFromRoomMutation({
    onSuccess: () => {
      sendJsonMessage({
        command: "load_beers",
      });
    },
  });

  const handleRemoveBeer = (id: number) => {
    beerRemoveMutation.mutate({ roomName, beerId: id });
    beerRemoveMutation.reset();
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleFetchMoreBeers = async () => {
    if (!hasNextPageBeers) return;
    await fetchNextPageBeers();
  };

  const [beersList, handlers] = useListState(beers);

  const beerReorderMutation = useAddBeerToRoomMutation({
    onSuccess: () => {
      sendJsonMessage({
        command: "load_beers",
      });
    },
  });

  const handleOnDragEnd: OnDragEndResponder = useCallback(
    ({ destination, source }) => {
      // dropped outside the list, keep item in the same position
      if (!destination) return;
      const fromPosition = source.index;
      const toPosition = destination?.index || 0;
      // do not reorder if the position did not change
      if (fromPosition === toPosition) return;

      // optimistic update
      handlers.reorder({
        from: fromPosition,
        to: toPosition,
      });

      // call the api to update the order
      void beerReorderMutation
        .mutateAsync({
          roomName,
          beerId: beersList[fromPosition]!.id,
          order: toPosition,
        })
        .catch((_) => {
          // rollback on error
          handlers.reorder({
            from: toPosition,
            to: fromPosition,
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [beersList]
  );

  // keep the client side state in sync with server state
  useLayoutEffect(() => {
    handlers.setState(beers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beers]);

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

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="beers-list" direction="vertical">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {beersList.map((item, index) => {
                  return (
                    <Draggable
                      key={`beer-${item.id}`}
                      draggableId={`beer-${item.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <BeerCardListItem
                          beer={item}
                          onRemove={handleRemoveBeer}
                          isRemoving={beerRemoveMutation.isLoading}
                          isDragging={snapshot.isDragging}
                          withHandle
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        />
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Grid.Col>
    </Grid>
  );
}
