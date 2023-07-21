"use client";

import {
  Paper,
  Text,
  Stack,
  TextInput,
  PasswordInput,
  Flex,
  Button,
  NumberInput,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { type CreateRoomPayload, createRoom } from "~/api/rooms";
import { MAX_ROOM_SLOTS, MIN_ROOM_SLOTS } from "~/config";

const useCreateRoomMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: CreateRoomPayload) => createRoom(data),
    onSuccess: (_, variables) => {
      notifications.show({
        title: "Success",
        message: "You have successfully created room.",
        color: "green",
      });
      router.push(`/dashboard/rooms/${variables.name}/`);
    },
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        notifications.show({
          title: "Error",
          message: "Something went wrong...",
          color: "red",
        });
        return;
      }
      if ((error?.response?.data as { host?: unknown })?.host) {
        notifications.show({
          title: "Could not create new room",
          message: "Your are already hosting a room. Finish it first.",
          color: "red",
        });
        return;
      }
      if ((error.response?.data as { name?: unknown })?.name) {
        notifications.show({
          title: "Could not create new room",
          message: "Room name is not unique or restricted!",
          color: "red",
        });
        return;
      }
      notifications.show({
        title: "Unexpected error",
        message: "Try again later...",
        color: "red",
      });
    },
  });
};

const MAX_ROOM_NAME_LENGTH = 8;

const RoomCreateForm = () => {
  const form = useForm({
    initialValues: {
      name: "",
      password: "",
      slots: 2,
    },
  });

  const mutation = useCreateRoomMutation();

  const handleSubmit = (values: CreateRoomPayload) => {
    mutation.mutate(values);
  };

  return (
    <Paper radius="md" p="xl" withBorder miw={400}>
      <Text size="xl" weight={500} align="center">
        {"Create Room"}
      </Text>

      <Form form={form} onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            required
            label="Room Name"
            placeholder="Enter room name"
            description={`Room name must be unique, lowercase and contain at most ${MAX_ROOM_NAME_LENGTH} characters.`}
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue(
                "name",
                event.currentTarget.value.toLowerCase()
              )
            }
            radius="md"
            maxLength={MAX_ROOM_NAME_LENGTH}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password (optional)"
            description="Leave empty if room is not password protected."
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            radius="md"
          />
          <NumberInput
            required
            label="Slots"
            placeholder="Enter slots"
            description={`Room's capacity including host. Minimum is ${MIN_ROOM_SLOTS} and maximum is ${MAX_ROOM_SLOTS}.`}
            value={form.values.slots}
            onChange={(value) => form.setFieldValue("slots", value as number)}
            radius="md"
            min={MIN_ROOM_SLOTS}
            max={MAX_ROOM_SLOTS}
          />
        </Stack>

        <Flex mt="xl" align="center" justify="center">
          <Button
            type="submit"
            radius="xl"
            miw={100}
            loading={mutation.isLoading}
          >
            {"Create"}
          </Button>
        </Flex>
      </Form>
    </Paper>
  );
};

export default RoomCreateForm;
