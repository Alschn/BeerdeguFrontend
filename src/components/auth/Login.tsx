"use client";

import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  type PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Flex,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import NextLink from "next/link";
import { notifications } from "@mantine/notifications";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import GoogleButton from "../GoogleButton";
import { type LoginPayload, getGoogleAuthUrl, login } from "~/api/auth";
import { APIError, isApiError } from "~/api/errors";
import { z } from "zod";

const useGoogleLoginInitMutation = () => {
  return useMutation({
    mutationFn: () => getGoogleAuthUrl(),
    onSuccess: (data) => {
      const { url } = data.data;
      // navigate to google auth page
      window.location.href = url;
    },
    onError: (_) => {
      // todo: handle error messages
      notifications.show({
        title: "Failed to redirect to Google authorization page",
        message: "Please try again later...",
      });
    },
  });
};

const ErrorCodes = {
  EMAIL_NOT_VERIFIED: "email_not_verified",
  NO_ACTIVE_ACCOUNT: "no_active_account",
} as const;

const useLoginMutation = () => {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: () => {
      notifications.show({
        title: "Login successful",
        message: "Redirecting to homepage...",
        color: "green",
      });
      let nextPath = next;
      if (next?.startsWith("/auth/login")) {
        nextPath = "/";
      }
      // force "hard" navigation instead of router.refresh to discard previous client state;
      // this way the layout will contain content that is not stale (user dropdown instead of auth buttons)
      window.location.replace(nextPath || "/");
    },
    onError: (error) => {
      if (!isApiError(error) || error?.response?.status === 500) {
        notifications.show({
          title: "Something went wrong",
          message: "Please try again later...",
          color: "red",
        });
        return;
      }

      const err = APIError.fromAxiosError(error);
      const emailErr = err.getErrorByCode(ErrorCodes.EMAIL_NOT_VERIFIED);
      if (emailErr) {
        notifications.show({
          title: "Your email is unverified",
          message: "Please check your email for a verification link.",
          color: "info",
        });
        return;
      }

      const validationErr = err.getErrorByCode(ErrorCodes.NO_ACTIVE_ACCOUNT);
      if (validationErr) {
        notifications.show({
          title: "Invalid credentials",
          message: "Please check your username and password.",
          color: "red",
        });
        return;
      }
    },
  });
};

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm(props: PaperProps) {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const mutation = useLoginMutation();
  const googleUrlMutation = useGoogleLoginInitMutation();

  const handleSubmit = (values: LoginPayload) => {
    mutation.mutate(values);
  };

  const handleGoogleLogin = () => {
    googleUrlMutation.mutate();
  };

  return (
    <Paper radius="md" p="xl" miw={{ xs: 320, sm: 400 }} withBorder {...props}>
      <Text size="lg" weight={500} align="center">
        {"Welcome to Beerdegu, login with"}
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton
          radius="xl"
          onClick={handleGoogleLogin}
          loading={googleUrlMutation.isLoading}
        />
      </Group>

      <Divider
        label="Or continue with username"
        labelPosition="center"
        my="lg"
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            {...form.getInputProps("username")}
            name="username"
            label="Username"
            placeholder="Enter username"
            radius="md"
            required
          />
          <PasswordInput
            {...form.getInputProps("password")}
            name="password"
            label="Password"
            placeholder="Enter password"
            radius="md"
            required
          />
        </Stack>

        <Group position="apart" mt="xl">
          <NextLink href={`/auth/password/reset/`}>
            <Anchor component="button" type="button" color="dimmed" size="xs">
              {"Forgot password?"}
            </Anchor>
          </NextLink>

          <NextLink href={`/auth/register`}>
            <Anchor component="button" type="button" color="dimmed" size="xs">
              {"Don't have an account? Register"}
            </Anchor>
          </NextLink>
        </Group>

        <Flex mt="xl" align="center" justify="center">
          <Button
            type="submit"
            radius="xl"
            loading={mutation.isLoading}
            miw={100}
          >
            {"Login"}
          </Button>
        </Flex>
      </form>
    </Paper>
  );
}
