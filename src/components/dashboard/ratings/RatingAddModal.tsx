import {
  Button,
  Flex,
  Loader,
  Modal,
  type ModalProps,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { useLayoutEffect, useMemo, useState } from "react";
import { type CreateRatingPayload } from "~/api/ratings";
import { useBeersPage } from "~/hooks/api/beers";
import BeerSelectItem from "./BeerSelectItem";

const NOTES = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
].reverse();

interface RatingAddModalProps extends Omit<ModalProps, "onSubmit"> {
  onSubmit: (values: CreateRatingPayload) => void;
  isLoading: boolean;
}

type CreateRatingForm = {
  beer: string | null;
  color: string;
  foam: string;
  smell: string;
  taste: string;
  opinion: string;
  note: string | null;
};

export default function RatingAddModal({
  opened,
  onClose,
  onSubmit,
  isLoading,
}: RatingAddModalProps) {
  const [beerSearch, setBeerSearch] = useState("");
  const [debouncedBeerSearch] = useDebouncedValue(beerSearch, 500);

  const beersQuery = useBeersPage({
    params: {
      search: debouncedBeerSearch,
      page_size: 50,
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: opened,
  });

  const beerOptions = useMemo(() => {
    return (
      beersQuery.data?.results.map((beer) => ({
        value: String(beer.id),
        label: beer.name,
        description: beer.brewery.name,
        badge: beer.style.name,
        image: beer.image,
      })) || []
    );
  }, [beersQuery.data]);

  const form = useForm<CreateRatingForm>({
    initialValues: {
      beer: null,
      color: "",
      foam: "",
      smell: "",
      taste: "",
      opinion: "",
      note: null,
    },
  });

  const handleSubmit = (values: CreateRatingForm) => {
    onSubmit({
      beer: Number(values.beer),
      color: values.color,
      foam: values.foam,
      smell: values.smell,
      taste: values.taste,
      opinion: values.opinion,
      note: Number(values.note),
    });
  };

  useLayoutEffect(() => {
    if (opened) return;
    // slow down clearing form to prevent animation glitches
    setTimeout(() => {
      form.reset();
      setBeerSearch("");
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const hasEmptyFields = useMemo(() => {
    return Object.values(form.values).some((v) => !v);
  }, [form.values]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={<Text size="xl" fw={700}>{`Add rating`}</Text>}
      scrollAreaComponent={ScrollArea.Autosize}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            {...form.getInputProps("beer")}
            searchValue={beerSearch}
            onSearchChange={setBeerSearch}
            data={beerOptions}
            name="beer"
            label="Beer"
            placeholder="Select beer..."
            nothingFound="No beers found"
            itemComponent={BeerSelectItem}
            rightSection={
              beersQuery.isLoading ? <Loader size="xs" /> : undefined
            }
            filter={() => true}
            searchable
            clearable
            required
          />
          <Textarea
            {...form.getInputProps("color")}
            name="color"
            label="Color"
            placeholder="Describe beer's color"
            required
          />
          <Textarea
            {...form.getInputProps("foam")}
            name="foam"
            label="Foam"
            placeholder="Describe beer's foam"
            required
          />
          <Textarea
            {...form.getInputProps("smell")}
            name="smell"
            label="Smell"
            placeholder="Describe beer's smell"
            required
          />
          <Textarea
            {...form.getInputProps("taste")}
            name="taste"
            label="Taste"
            placeholder="Describe beer's taste"
            required
          />
          <Textarea
            {...form.getInputProps("opinion")}
            name="opinion"
            label="Opinion"
            placeholder="Describe your overall opinion"
            minRows={3}
            required
          />
          <Select
            {...form.getInputProps("note")}
            data={NOTES}
            name="note"
            label="Note"
            placeholder="Your note"
            required
          />
          <Flex align="center" justify="space-between">
            <Button
              variant="outline"
              color="red"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} disabled={hasEmptyFields}>
              Submit
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
}
