"use client";

import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  type PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import NextLink from "next/link";
import { notifications } from "@mantine/notifications";
import GoogleButton from "../GoogleButton";
import { type RegisterPayload, register, getGoogleAuthUrl } from "~/api/auth";

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
      if (error instanceof AxiosError) {
        notifications.show({
          title: "Failed to create account",
          message: "Make sure you entered correct data",
          color: "red",
        });
        return;
      }
      notifications.show({
        title: "Something went wrong",
        message: "Try again later...",
        color: "red",
      });
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
    onError: () => {
      notifications.show({
        title: "Failed to redirect to Google authorization page",
        message: "Please try again later...",
      });
    },
  });
};

const MIN_PASSWORD_LENGTH = 6;

export function RegisterForm(props: PaperProps) {
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password1: "",
      password2: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password1: (val) =>
        val.length <= MIN_PASSWORD_LENGTH
          ? `Password should include at least ${MIN_PASSWORD_LENGTH} characters`
          : null,
      password2: (val, values) =>
        val !== values.password1 ? "Passwords do not match" : null,
    },
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
    <Paper radius="md" p="xl" withBorder miw={400} {...props}>
      <Text size="lg" weight={500} align="center">
        {"Welcome to Beerdegu, register with"}
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl" onClick={handleGoogleLogin} />
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleSubmitRegister)}>
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
          <TextInput
            required
            label="Email"
            placeholder="Enter email"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
          />
          <PasswordInput
            required
            label="Password"
            placeholder="Enter password"
            value={form.values.password1}
            onChange={(event) =>
              form.setFieldValue("password1", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              `"Password should include at least ${MIN_PASSWORD_LENGTH} characters"`
            }
            radius="md"
          />
          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm password"
            value={form.values.password2}
            onChange={(event) =>
              form.setFieldValue("password2", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              `Password should include at least ${MIN_PASSWORD_LENGTH} characters`
            }
            radius="md"
          />
          <Checkbox
            required
            label="I accept terms and conditions"
            checked={form.values.terms}
            onChange={(event) =>
              form.setFieldValue("terms", event.currentTarget.checked)
            }
            error={form.errors.terms && "You must accept terms and conditions"}
          />
        </Stack>
        <Group position="apart" mt="xl">
          <NextLink href="/auth/login">
            <Anchor component="button" type="button" color="dimmed" size="xs">
              {"Already have an account? Login"}
            </Anchor>
          </NextLink>
          <Button
            type="submit"
            radius="xl"
            loading={registerMutation.isLoading}
          >
            {"Register"}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
