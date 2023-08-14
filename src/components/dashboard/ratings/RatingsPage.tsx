"use client";

import { Button, Card, Center, Container, Flex, Loader } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo, useState, type ChangeEvent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  createRating,
  deleteRating,
  getRatings,
  updateRating,
  type CreateRatingPayload,
  type RatingsParams,
  type UpdateRatingPayload,
} from "~/api/ratings";
import {
  type PaginatedResponseData,
  type Rating as RatingType,
} from "~/api/types";
import SearchInput from "~/components/SearchInput";
import { getNextPageParam } from "~/utils/tanstack-query";
import RatingAddModal from "./RatingAddModal";
import RatingCard from "./RatingCard";
import RatingDeleteConfirmModal from "./RatingDeleteConfirmModal";
import RatingUpdateModal from "./RatingUpdateModal";

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
    initialDataUpdatedAt: new Date().getTime(),
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
