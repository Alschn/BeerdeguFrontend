"use client";

import {
  Avatar,
  Button,
  Card,
  CardSection,
  Center,
  Divider,
  Grid,
  PasswordInput,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { type ChangePasswordPayload, changePassword } from "~/api/auth";
import { useAuth } from "../context/auth";

const AccountDetailsCard = () => {
  const { user } = useAuth();
  const username = user?.username;
  const email = user?.email;

  // todo: mutation

  const handleAvatarChange = () => {
    // todo: update avatar
  };

  const handleSubmit = () => {
    // todo: update data
  };

  return (
    <Card>
      <CardSection pt="sm">
        <Center>
          {/* todo: avatar upload, current image */}
          <Avatar size={120} />
        </Center>
      </CardSection>
      <Divider my="md" />
      <Stack spacing="sm">
        {/* todo: current username, email */}
        <TextInput
          name="username"
          label="Username"
          placeholder="Username"
          value={username}
          disabled
        />
        <TextInput
          name="email"
          label="Email"
          placeholder="Email"
          value={email}
          disabled
        />
      </Stack>
      <Divider my="md" />
      <form>
        <Stack spacing="sm">
          <TextInput
            name="first_name"
            label="First name"
            placeholder="First name"
            disabled
          />
          <TextInput
            name="last_name"
            label="Last name"
            placeholder="Last name"
            disabled
          />
          <Textarea
            name="bio"
            label="Bio"
            minRows={3}
            placeholder="Tell us about yourself"
            disabled
          />
          <Center>
            <Button type="submit" disabled>
              Save
            </Button>
          </Center>
        </Stack>
      </form>
    </Card>
  );
};

interface ChangePasswordMutationOptions {
  onSuccess?: () => void;
}

const usePasswordChangeMutation = (options?: ChangePasswordMutationOptions) => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
    onSuccess: () => {
      notifications.show({
        title: "Password changed",
        message: "Your password has been changed",
        color: "green",
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      if (!(error instanceof AxiosError)) {
        notifications.show({
          title: "Something went wrong...",
          message: "Your password could not be changed",
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Password change failed",
        message: "Make sure you entered correct password",
        color: "red",
      });
    },
  });
};

const NEW_PASSWORD_MIN_LENGTH = 6;

const ChangePasswordCard = () => {
  const form = useForm({
    initialValues: {
      old_password: "",
      new_password1: "",
      new_password2: "",
    },
    validate(values) {
      if (values.new_password1 !== values.new_password2) {
        return {
          new_password1: "Passwords do not match",
          new_password2: "Passwords do not match",
        };
      }
      if (values.old_password === values.new_password1) {
        return {
          new_password1: "New password cannot be the same as old password",
        };
      }
      return {};
    },
  });

  const mutation = usePasswordChangeMutation({
    onSuccess: () => form.reset(),
  });

  const handleSubmit = (values: ChangePasswordPayload) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <Title order={2} mb="sm" align="center">
        Change password
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <PasswordInput
            name="old_password"
            label="Old password"
            placeholder="Old password"
            value={form.values.old_password}
            onChange={(event) =>
              form.setFieldValue("old_password", event.currentTarget.value)
            }
            error={form.errors.old_password}
            required
          />
          <PasswordInput
            name="new_password1"
            label="New password"
            placeholder="New password"
            description={`New password must be at least ${NEW_PASSWORD_MIN_LENGTH} characters long`}
            value={form.values.new_password1}
            onChange={(event) =>
              form.setFieldValue("new_password1", event.currentTarget.value)
            }
            error={form.errors.new_password1}
            minLength={NEW_PASSWORD_MIN_LENGTH}
            required
          />
          <PasswordInput
            name="new_password2"
            label="Confirm new password"
            placeholder="Confirm new password"
            description={`New password must be at least ${NEW_PASSWORD_MIN_LENGTH} characters long`}
            value={form.values.new_password2}
            onChange={(event) =>
              form.setFieldValue("new_password2", event.currentTarget.value)
            }
            error={form.errors.new_password2}
            minLength={NEW_PASSWORD_MIN_LENGTH}
            required
          />
          <Center>
            <Button type="submit" loading={mutation.isLoading}>
              Save
            </Button>
          </Center>
        </Stack>
      </form>
    </Card>
  );
};

export default function AccountPage() {
  return (
    <Grid>
      <Grid.Col span={12} sm={6}>
        <AccountDetailsCard />
      </Grid.Col>
      <Grid.Col span={12} sm={6}>
        <ChangePasswordCard />
      </Grid.Col>
    </Grid>
  );
}
