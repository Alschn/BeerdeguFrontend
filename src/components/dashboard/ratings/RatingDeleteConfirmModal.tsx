import {
  Button,
  Modal,
  type ModalProps,
  Text,
  Stack,
  Flex,
} from "@mantine/core";
import { type Rating } from "~/api/types";

interface RatingDeleteConfirmModalProps extends ModalProps {
  rating: Rating;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function RatingDeleteConfirmModal({
  opened,
  onClose,
  onDelete,
  isLoading,
  rating,
}: RatingDeleteConfirmModalProps) {
  const handleConfirm = () => {
    onDelete(rating.id);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text size="xl" fw={700}>{`Rating #${rating.id}`}</Text>}
      centered
    >
      <Stack spacing={16}>
        <Text size="lg" fw={600}>
          Are you sure you want to delete this rating? This action cannot be
          undone.
        </Text>
        <Flex justify="end" gap={16}>
          <Button
            variant="outline"
            color="gray"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button color="red" onClick={handleConfirm} loading={isLoading}>
            Delete
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
}
