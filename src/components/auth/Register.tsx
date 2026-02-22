"use client";

import {
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  type PaperProps,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import NextLink from "next/link";
import { getGoogleAuthUrl, register, type RegisterPayload } from "~/api/auth";
import { APIError, isApiError } from "~/api/errors";
import GoogleButton from "../GoogleButton";
import { z } from "zod";

const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => register(data),
    onSuccess: () => {
      notifications.show({
        title: "Account created",
        message: "Please check your email for a verification link.",
        color: "info",
      });
    },
    onError: (error) => {
      if (!isApiError(error)) {
        notifications.show({
          title: "Something went wrong",
          message: "Try again later...",
          color: "red",
        });
        return;
      }

      const err = APIError.fromAxiosError(error);
      // todo: improve errors
      if (err.type === "validation_error") {
        notifications.show({
          title: "Please correct the following errors:",
          message: err.details.join(", "),
          color: "red",
          autoClose: 5000,
        });
        return;
      }
    },
  });
};

const useGoogleLoginInitMutation = () => {
  // todo: do not duplicate code in login/register files
  return useMutation({
    mutationFn: () => getGoogleAuthUrl(),
    onSuccess: (data) => {
      const { url } = data.data;
      // navigate to google auth page
      window.location.href = url;
    },
    onError: (_) => {
      // todo: handle errors
      notifications.show({
        title: "Failed to redirect to Google authorization page",
        message: "Please try again later...",
      });
    },
  });
};

const MIN_PASSWORD_LENGTH = 8;
const MIN_PASSWORD_LENGTH_MESSAGE = `Password should include at least ${MIN_PASSWORD_LENGTH} characters`;
const PASSWORDS_DO_NOT_MATCH_MESSAGE = "Passwords do not match";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
    password1: z.string().min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MESSAGE),
    password2: z.string().min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MESSAGE),
  })
  .refine((data) => data.password1 === data.password2, {
    path: ["password2"],
    message: PASSWORDS_DO_NOT_MATCH_MESSAGE,
  });

export function RegisterForm(props: PaperProps) {
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password1: "",
      password2: "",
    },
    validate: zodResolver(registerSchema),
  });

  const registerMutation = useRegisterMutation();
  const googleUrlMutation = useGoogleLoginInitMutation();

  const handleSubmitRegister = (values: RegisterPayload) => {
    registerMutation.mutate(values);
  };

  const handleGoogleLogin = () => {
    googleUrlMutation.mutate();
  };

  return (
    <Paper
      radius="md"
      p="xl"
      mt={32}
      miw={{ xs: 320, sm: 400 }}
      withBorder
      {...props}
    >
      <Text size="lg" weight={500} align="center">
        {"Welcome to Beerdegu, register with"}
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl" onClick={handleGoogleLogin} />
      </Group>

      <Divider
        label="Or continue with credentials"
        labelPosition="center"
        my="lg"
      />

      <form onSubmit={form.onSubmit(handleSubmitRegister)}>
        <Stack>
          <TextInput
            {...form.getInputProps("username")}
            name="username"
            label="Username"
            placeholder="Enter username"
            radius="md"
            required
          />
          <TextInput
            {...form.getInputProps("email")}
            type="email"
            name="email"
            label="Email"
            placeholder="Enter email"
            radius="md"
            required
          />
          <PasswordInput
            {...form.getInputProps("password1")}
            name="password1"
            label="Password"
            placeholder="Enter password"
            description={MIN_PASSWORD_LENGTH_MESSAGE}
            minLength={MIN_PASSWORD_LENGTH}
            radius="md"
            required
          />
          <PasswordInput
            {...form.getInputProps("password2")}
            name="password2"
            label="Confirm Password"
            placeholder="Confirm password"
            description={MIN_PASSWORD_LENGTH_MESSAGE}
            minLength={MIN_PASSWORD_LENGTH}
            radius="md"
            required
          />
        </Stack>
        <Group position="apart" mt="xl">
          <NextLink href="/auth/login">
            <Anchor component="button" type="button" color="dimmed" size="xs">
              {"Already have an account? Login"}
            </Anchor>
          </NextLink>
        </Group>
        <Flex mt="xl" align="center" justify="center">
          <Button
            type="submit"
            radius="xl"
            loading={registerMutation.isLoading}
          >
            {"Register"}
          </Button>
        </Flex>
      </form>
    </Paper>
  );
}
