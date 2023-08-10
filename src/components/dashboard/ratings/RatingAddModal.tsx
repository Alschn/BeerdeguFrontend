import {
  Modal,
  Stack,
  type ModalProps,
  Textarea,
  Select,
  Button,
  Group,
  Avatar,
  Text,
  Loader,
  Flex,
  Badge,
  ScrollArea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconBottle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useMemo,
  useState,
  useLayoutEffect,
} from "react";
import { type BeersParams, getBeers } from "~/api/beers";
import { type CreateRatingPayload } from "~/api/ratings";

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

interface BeerSelectItemProps extends ComponentPropsWithoutRef<"div"> {
  image: string | null;
  label: string;
  description: string;
  badge: string;
}

const BeerSelectItem = forwardRef<HTMLDivElement, BeerSelectItemProps>(
  ({ image, label, description, badge, ...rest }: BeerSelectItemProps, ref) => (
    <div ref={ref} {...rest}>
      <Group noWrap>
        <Avatar
          src={image}
          alt={label}
          size={64}
          imageProps={{
            style: {
              objectFit: "contain",
            },
          }}
        >
          <IconBottle size="1.5rem" />
        </Avatar>
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
          <Badge size="xs">{badge}</Badge>
        </div>
      </Group>
    </div>
  )
);
BeerSelectItem.displayName = "BeerSelectItem";

export default function RatingAddModal({
  opened,
  onClose,
  onSubmit,
  isLoading,
}: RatingAddModalProps) {
  const [beerSearch, setBeerSearch] = useState("");
  const [debouncedBeerSearch] = useDebouncedValue(beerSearch, 500);

  const beersQuery = useQuery({
    queryKey: [
      "beers",
      { search: debouncedBeerSearch, page_size: 20 } satisfies BeersParams,
    ] as const,
    queryFn: async ({ queryKey }) => {
      const res = await getBeers(queryKey[1]);
      return res.data;
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
            name="beer"
            label="Beer"
            placeholder="Select beer..."
            nothingFound="No beers found"
            itemComponent={BeerSelectItem}
            rightSection={
              beersQuery.isLoading ? <Loader size="xs" /> : undefined
            }
            data={beerOptions}
            searchValue={beerSearch}
            onSearchChange={setBeerSearch}
            value={form.values.beer}
            onChange={(value) => form.setFieldValue("beer", value)}
            filter={() => true}
            searchable
            clearable
            required
          />
          <Textarea
            name="color"
            label="Color"
            placeholder="Describe beer's color"
            value={form.values.color}
            onChange={(event) =>
              form.setFieldValue("color", event.currentTarget.value)
            }
            required
          />
          <Textarea
            name="foam"
            label="Foam"
            placeholder="Describe beer's foam"
            value={form.values.foam}
            onChange={(event) =>
              form.setFieldValue("foam", event.currentTarget.value)
            }
            required
          />
          <Textarea
            name="smell"
            label="Smell"
            placeholder="Describe beer's smell"
            value={form.values.smell}
            onChange={(event) =>
              form.setFieldValue("smell", event.currentTarget.value)
            }
            required
          />
          <Textarea
            name="taste"
            label="Taste"
            placeholder="Describe beer's taste"
            value={form.values.taste}
            onChange={(event) =>
              form.setFieldValue("taste", event.currentTarget.value)
            }
            required
          />
          <Textarea
            name="opinion"
            label="Opinion"
            placeholder="Describe your overall opinion"
            value={form.values.opinion}
            onChange={(event) =>
              form.setFieldValue("opinion", event.currentTarget.value)
            }
            minRows={3}
            required
          />
          <Select
            name="note"
            label="Note"
            placeholder="Your note"
            data={NOTES}
            value={form.values.note}
            onChange={(value) => form.setFieldValue("note", value)}
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
