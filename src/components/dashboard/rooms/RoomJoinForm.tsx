"use client";

import {
  Paper,
  Text,
  Stack,
  TextInput,
  PasswordInput,
  Flex,
  Button,
} from "@mantine/core";
import { Form, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { joinRoom } from "~/api/rooms";

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
    onError: () => {
      // todo: better error handling
      notifications.show({
        title: "Error",
        message: "Something went wrong...",
        color: "red",
      });
    },
  });
};

const RoomJoinForm = () => {
  const form = useForm({
    initialValues: {
      name: "",
      password: "",
    },
  });

  const mutation = useRoomJoinMutation();

  const handleSubmit = (values: JoinRoomPayload) => {
    mutation.mutate(values);
  };

  return (
    <Paper radius="md" p="xl" withBorder miw={400}>
      <Text size="xl" weight={500} align="center">
        {"Join Room"}
      </Text>

      <Form form={form} onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            required
            label="Room Name"
            placeholder="Enter room name"
            description="Room name must be unique."
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue("name", event.currentTarget.value)
            }
            radius="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password (optional)"
            description="Leave empty if you don't want to set password."
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            radius="md"
          />
        </Stack>

        <Flex mt="xl" align="center" justify="center">
          <Button
            type="submit"
            radius="xl"
            miw={100}
            loading={mutation.isLoading}
          >
            {"Join"}
          </Button>
        </Flex>
      </Form>
    </Paper>
  );
};

export default RoomJoinForm;
