import {
  Button,
  Modal,
  Stack,
  type ModalProps,
  TextInput,
  Textarea,
  Select,
  Flex,
  Text,
  ScrollArea,
  Group,
  Badge,
  Avatar,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBottle } from "@tabler/icons-react";
import { type UpdateRatingPayload } from "~/api/ratings";
import { type Rating } from "~/api/types";

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

interface RatingUpdateModalProps extends Omit<ModalProps, "onSubmit"> {
  rating: Rating;
  onSubmit: (id: number, data: UpdateRatingPayload) => void;
  isLoading: boolean;
}

type UpdateRatingForm = {
  color: string;
  foam: string;
  smell: string;
  taste: string;
  opinion: string;
  note: string | null;
};

export default function RatingUpdateModal({
  opened,
  onClose,
  onSubmit,
  isLoading,
  rating,
}: RatingUpdateModalProps) {
  const form = useForm<UpdateRatingForm>({
    initialValues: {
      color: rating.color || "",
      foam: rating.foam || "",
      smell: rating.smell || "",
      taste: rating.taste || "",
      opinion: rating.opinion || "",
      note: !!rating.note ? String(rating.note) : null,
    },
  });

  const handleSubmit = (values: UpdateRatingForm) => {
    onSubmit(rating.id, {
      ...values,
      note: values.note ? Number(values.note) : null,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      title={<Text size="xl" fw={700}>{`Rating #${rating.id}`}</Text>}
      scrollAreaComponent={ScrollArea.Autosize}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {/* todo: extract into component */}
          <Group noWrap>
            <Avatar
              src={rating.beer.image}
              alt={rating.beer.name}
              size={80}
              imageProps={{
                style: {
                  objectFit: "contain",
                },
              }}
            >
              <IconBottle size="1.5rem" />
            </Avatar>
            <div>
              <Text size="xl">{rating.beer.name}</Text>
              <Text size="lg" opacity={0.65}>
                {rating.beer.brewery}
              </Text>
              <Badge size="sm">{rating.beer.style}</Badge>
            </div>
          </Group>
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
            <Button
              type="submit"
              loading={isLoading}
              disabled={!form.isTouched}
            >
              Update
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
}
