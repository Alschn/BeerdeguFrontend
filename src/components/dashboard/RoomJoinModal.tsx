import {
  Button,
  Group,
  Modal,
  Text,
  type ModalProps,
  PasswordInput,
  Stack,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { joinRoom } from "~/api/rooms";
import { type Room } from "~/api/types";

// todo: do not duplicate mutation code
type JoinRoomPayload = {
  name: string;
  password: string;
};

const useRoomJoinMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: JoinRoomPayload) => joinRoom(data.name, data.password),
    onSuccess: (_, variables) => {
      notifications.show({
        title: "Success",
        message: "You have successfully joined the room.",
        color: "green",
      });
      router.push(`/dashboard/rooms/${variables.name}/`);
    },
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        notifications.show({
          title: "Something went wrong",
          message: "Try again later...",
          color: "red",
        });
        return;
      }
      notifications.show({
        title: "Could not join the room",
        message: "Make sure you have entered the correct password.",
        color: "red",
      });
    },
  });
};

interface RoomJoinModalProps extends Omit<ModalProps, "opened"> {
  isOpen: boolean;
  room: Room;
}

export default function RoomJoinModal({
  isOpen,
  onClose,
  room,
}: RoomJoinModalProps) {
  const [value, setValue] = useState("");

  const mutation = useRoomJoinMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name: room.name, password: value });
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<Title order={3}>{room.name}</Title>}
      centered
      size="xs"
    >
      <form onSubmit={handleSubmit}>
        <Stack mb={16}>
          {room.has_password ? (
            <PasswordInput
              name="password"
              label="Room Code"
              placeholder="Room Code"
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
              required
            />
          ) : (
            <Text>
              This room does not have a password. You can join without it.
            </Text>
          )}
        </Stack>
        <Group position="right">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isLoading || mutation.isSuccess}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={mutation.isLoading}
            disabled={mutation.isSuccess}
          >
            Join
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
