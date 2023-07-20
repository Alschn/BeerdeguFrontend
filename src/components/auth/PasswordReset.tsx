"use client";

import {
  createStyles,
  Paper,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Box,
  Flex,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import NextLink from "next/link";
import { type FormEvent } from "react";
import { notifications } from "@mantine/notifications";
import { type EmailResetPayload, resetPassword } from "~/api/auth";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
}));

const usePasswordResetMutation = () => {
  return useMutation({
    mutationFn: (data: EmailResetPayload) => resetPassword(data),
    onSuccess: () => {
      notifications.show({
        title: "Email sent",
        message: "Check your inbox for the reset link",
        color: "green",
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        notifications.show({
          title: "Email not sent",
          message: "Please check your email address",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Something went wrong",
        message: "Please try again later...",
        color: "red",
      });
    },
  });
};

export default function PasswordReset() {
  const { classes } = useStyles();
  const mutation = usePasswordResetMutation();

  const emailSent = mutation.isSuccess;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const email = data.get("email") as string;
    mutation.mutate({ email });
  };

  if (emailSent) {
    return (
      <Container size={460}>
        <Paper withBorder shadow="md" p={30} radius="md" miw={400}>
          <Flex mb="xl" direction="column" align="center" justify="center">
            <Text className={classes.title}>{"Email sent"}</Text>
            <Text c="dimmed" fz="sm" ta="center">
              {"Check your inbox for the reset link"}
            </Text>
          </Flex>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={460}>
      <Paper withBorder shadow="md" p={30} radius="md" miw={400}>
        <Box mb="xl">
          <Text className={classes.title} align="center" mb="sm">
            {"Forgot your password?"}
          </Text>
          <Text c="dimmed" fz="sm" ta="center">
            {"Enter your email to get a reset link"}
          </Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextInput
            id="email"
            name="email"
            label="Your email"
            placeholder="Your email"
            required
          />
          <Group position="apart" mt="xl">
            <NextLink href={`/auth/login`}>
              <Anchor component="button" type="button" color="dimmed" size="xs">
                {"Back to the login page"}
              </Anchor>
            </NextLink>
          </Group>
          <Flex mt="xl" align="center" justify="center">
            <Button radius="xl" type="submit" loading={mutation.isLoading}>
              {"Reset password"}
            </Button>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
}
