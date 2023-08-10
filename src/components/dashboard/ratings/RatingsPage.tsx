"use client";

import {
  Card,
  Image,
  Grid,
  Flex,
  Button,
  Stack,
  Rating,
  Textarea,
  Box,
  Text,
  Avatar,
  Title,
  Container,
  Divider,
  Badge,
  Group,
  ActionIcon,
  Tooltip,
  Center,
  Loader,
} from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import {
  RoomStates,
  type PaginatedResponseData,
  type Rating as RatingType,
} from "~/api/types";
import NextLink from "next/link";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import RatingAddModal from "./RatingAddModal";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type CreateRatingPayload,
  type UpdateRatingPayload,
  createRating,
  deleteRating,
  updateRating,
  getRatings,
  type RatingsParams,
} from "~/api/ratings";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { type ChangeEvent, useMemo, useState } from "react";
import RatingDeleteConfirmModal from "./RatingDeleteConfirmModal";
import RatingUpdateModal from "./RatingUpdateModal";
import { getNextPageParam } from "~/utils/tanstack-query";
import SearchInput from "~/components/SearchInput";
import InfiniteScroll from "react-infinite-scroll-component";

const intl = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const MAX_INPUT_LENGTH = 300;

interface RatingCardProps {
  rating: RatingType;
  onEdit: (rating: RatingType) => void;
  onDelete: (rating: RatingType) => void;
}

function RatingCard({ rating, onEdit, onDelete }: RatingCardProps) {
  const isInRoom = !!rating.room;
  const isInRoomInProgress =
    isInRoom && rating.room.state === RoomStates.IN_PROGRESS;

  const canEdit = !isInRoom || isInRoomInProgress;
  const canDelete = !isInRoom;

  const handleOpenEdit = () => onEdit(rating);
  const handleOpenDelete = () => onDelete(rating);

  return (
    <Card key={`rating-${rating.id}`} shadow="sm">
      <Flex justify="space-between" align="center">
        <Box>
          <Title>Rating #{rating.id}</Title>
          {isInRoom && (
            <Title order={2} opacity={0.65} fw={500}>
              Room: {rating.room.name}
            </Title>
          )}
        </Box>
        <Group align="center">
          {canEdit && (
            <Tooltip label="Edit">
              <ActionIcon
                variant="light"
                color="yellow.6"
                onClick={handleOpenEdit}
              >
                <IconEdit />
              </ActionIcon>
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip label="Delete">
              <ActionIcon
                variant="light"
                color="red"
                onClick={handleOpenDelete}
              >
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Flex>
      <Divider my={8} />
      <Flex mb={16} gap={16} align="center">
        <Box>
          <Avatar radius="xl" size={48}>
            {rating.added_by.username.substring(0, 2)}
          </Avatar>
        </Box>
        <Flex direction="column">
          <Text size="lg" fw={700}>
            {rating.added_by.username}
          </Text>
          <Text size="sm">{intl.format(new Date(rating.created_at))}</Text>
        </Flex>
      </Flex>
      <Grid>
        <Grid.Col span={12} sm={4}>
          <Flex align="center" justify="center" w="100%" mb={16} pt={16}>
            <Image
              src={rating.beer.image}
              alt={rating.beer.name}
              height={200}
              withPlaceholder
              fit="contain"
            />
          </Flex>
          <Flex direction="column">
            <NextLink href={`/dashboard/browser/beers/${rating.beer.id}`}>
              <Title order={2}>{rating.beer.name}</Title>
            </NextLink>
            <Text size="lg">{rating.beer.brewery}</Text>
            {!!rating.beer.style && (
              <Box>
                <Badge size="sm">{rating.beer.style}</Badge>
              </Box>
            )}
          </Flex>
        </Grid.Col>
        <Grid.Col span={12} sm={8}>
          <Stack spacing={16}>
            <Textarea
              id={`rating-${rating.id}-color`}
              name={`rating-${rating.id}-color`}
              value={rating.color || ""}
              label="Color"
              placeholder="Color"
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Textarea
              id={`rating-${rating.id}-foam`}
              name={`rating-${rating.id}-foam`}
              value={rating.foam || ""}
              label="Foam"
              placeholder="Foam"
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Textarea
              id={`rating-${rating.id}-smell`}
              name={`rating-${rating.id}-smell`}
              value={rating.smell || ""}
              label="Smell"
              placeholder="Smell"
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Textarea
              id={`rating-${rating.id}-taste`}
              name={`rating-${rating.id}-taste`}
              value={rating.taste || ""}
              label="Taste"
              placeholder="Taste"
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Textarea
              id={`rating-${rating.id}-opinion`}
              name={`rating-${rating.id}-opinion`}
              value={rating.opinion || ""}
              label="Opinion"
              placeholder="Opinion"
              minRows={3}
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Flex align="center" gap={16}>
              <Rating value={rating.note || 0} count={10} readOnly />
              <Text size="sm" fw={600}>
                ({rating.note || "?"}/{10})
              </Text>
            </Flex>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

interface RatingsPageProps {
  initialData: PaginatedResponseData<RatingType>;
}

export default function RatingsPage({ initialData }: RatingsPageProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [selectedRow, setSelectedRow] = useState<RatingType | null>(null);

  const [isAddModalOpen, addModalHandlers] = useDisclosure(false);
  const [isUpdateModalOpen, updateModalHandlers] = useDisclosure(false);
  const [isDeleteModalOpen, deleteModalHandlers] = useDisclosure(false);

  const client = useQueryClient();

  const {
    data: dataRatings,
    isLoading: isLoadingRatings,
    hasNextPage: hasNextPageRatings,
    fetchNextPage: fetchNextPageRatings,
  } = useInfiniteQuery({
    queryKey: [
      "ratings",
      { search: debouncedSearch } satisfies RatingsParams,
    ] as const,
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const res = await getRatings({
        page: pageParam as number,
        ...queryKey[1],
      });
      return res.data;
    },
    initialData: {
      pages: [initialData],
      pageParams: [1],
    },
    refetchOnWindowFocus: false,
    getNextPageParam: getNextPageParam,
  });

  const ratings = useMemo(() => {
    return dataRatings?.pages.flatMap((page) => page.results) || [];
  }, [dataRatings]);

  const createMutation = useMutation({
    mutationFn: (data: CreateRatingPayload) => createRating(data),
    onSuccess: async () => {
      notifications.show({
        title: "Success!",
        message: "Rating has been created",
        color: "green",
      });
      addModalHandlers.close();
      await client.invalidateQueries(["ratings"]);
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
        title: "Could not create a new rating!",
        message: "Please check if your data is correct.",
        color: "red",
      });
    },
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UpdateRatingPayload) =>
      updateRating(id, payload),
    onSuccess: (res, variables) => {
      notifications.show({
        title: "Success!",
        message: "Rating has been updated",
        color: "green",
      });
      updateModalHandlers.close();
      client.setQueryData<InfiniteData<PaginatedResponseData<unknown>>>(
        ["ratings"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            pages: oldData.pages.map((p) => {
              if (!p.results.some((r) => (r as RatingType).id === variables.id))
                return p;

              return {
                ...p,
                results: p.results.map((r) =>
                  (r as RatingType).id === variables.id ? res.data : r
                ),
              };
            }),
            pageParams: oldData.pageParams,
          };
        }
      );
    },
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        notifications.show({
          title: "Something went wrong!",
          message: "Try again later...",
        });
        return;
      }
      notifications.show({
        title: "Could not update rating!",
        message: "Please check if your data is correct.",
        color: "red",
      });
    },
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteRating(id),
    onSuccess: async () => {
      notifications.show({
        title: "Success!",
        message: "Rating has been deleted",
        color: "blue",
      });
      deleteModalHandlers.close();
      await client.invalidateQueries(["ratings"]);
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
        title: "Could not delete rating!",
        message: "Please try again later...",
        color: "red",
      });
    },
    retry: false,
  });

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFetchNextPage = async () => {
    if (!hasNextPageRatings) return;
    await fetchNextPageRatings();
  };

  const handleAdd = (data: CreateRatingPayload) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (id: number, data: UpdateRatingPayload) => {
    updateMutation.mutate({ id, ...data });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOpenUpdateModal = (rating: RatingType) => {
    setSelectedRow(rating);
    updateModalHandlers.open();
  };

  const handleOpenDeleteModal = (rating: RatingType) => {
    setSelectedRow(rating);
    deleteModalHandlers.open();
  };

  const handleCloseUpdateModal = () => {
    updateModalHandlers.close();
    setSelectedRow(null);
  };

  const handleCloseDeleteModal = () => {
    deleteModalHandlers.close();
    setSelectedRow(null);
  };

  return (
    <Container>
      <RatingAddModal
        opened={isAddModalOpen}
        onClose={addModalHandlers.close}
        onSubmit={handleAdd}
        isLoading={createMutation.isLoading}
      />
      {selectedRow && (
        <>
          <RatingUpdateModal
            rating={selectedRow}
            opened={isUpdateModalOpen}
            onClose={handleCloseUpdateModal}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isLoading}
          />
          <RatingDeleteConfirmModal
            rating={selectedRow}
            opened={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onDelete={handleDelete}
            isLoading={deleteMutation.isLoading}
          />
        </>
      )}
      <Card mb={16}>
        <Flex justify="space-between" align="center" gap={16}>
          <SearchInput value={search} onChange={handleChangeSearch} />
          <Button
            leftIcon={<IconPlus size="1rem" />}
            onClick={addModalHandlers.open}
          >
            Add rating
          </Button>
        </Flex>
      </Card>
      <InfiniteScroll
        dataLength={initialData.count}
        next={handleFetchNextPage}
        hasMore={Boolean(hasNextPageRatings)}
        loader={<></>}
        scrollThreshold={0.95}
        scrollableTarget="ratings-container"
      >
        <Flex direction="column" gap={16} mb={16} id="ratings-container">
          {ratings.map((rating) => (
            <RatingCard
              rating={rating}
              key={`rating-${rating.id}`}
              onEdit={handleOpenUpdateModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </Flex>
      </InfiniteScroll>
      {isLoadingRatings && (
        <Center py="lg">
          <Loader size="lg" />
        </Center>
      )}
    </Container>
  );
}
