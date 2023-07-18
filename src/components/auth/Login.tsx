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
import { useForm } from "@mantine/form";
import NextLink from "next/link";
import { notifications } from "@mantine/notifications";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import GoogleButton from "../GoogleButton";
import { type LoginPayload, getGoogleAuthUrl, login } from "~/api/auth";

const useGoogleLoginInitMutation = () => {
  return useMutation({
    mutationFn: () => getGoogleAuthUrl(),
    onSuccess: (data) => {
      const { url } = data.data;
      // navigate to google auth page
      window.location.href = url;
    },
    onError: () => {
      notifications.show({
        title: "Failed to redirect to Google authorization page",
        message: "Please try again later...",
      });
    },
  });
};

const useLoginMutation = () => {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: () => {
      notifications.show({
        title: "Login successful",
        message: "Redirecting to homepage...",
        color: "green",
      });
      router.refresh();
      router.push(next || "/");
    },
    onError: (error) => {
      if (!(error instanceof AxiosError) || error?.response?.status === 500) {
        notifications.show({
          title: "Something went wrong",
          message: "Please try again later...",
          color: "red",
        });
        return;
      }

      if (
        error.response?.status === 400 &&
        (error.response?.data as { email?: string })?.email
      ) {
        notifications.show({
          title: "Your email is unverified",
          message: "Please check your email for a verification link.",
          color: "info",
        });
        return;
      }

      if (error.response?.status === 400) {
        notifications.show({
          title: "Login failed",
          message: "Please check your username and password",
          color: "red",
        });
        return;
      }
    },
  });
};

export function LoginForm(props: PaperProps) {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
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
    <Paper radius="md" p="xl" withBorder miw={400} {...props}>
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
            required
            label="Username"
            placeholder="Enter username"
            value={form.values.username}
            onChange={(event) =>
              form.setFieldValue("username", event.currentTarget.value)
            }
            error={form.errors.username && "Invalid username"}
            radius="md"
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Enter password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
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
