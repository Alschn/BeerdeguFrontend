"use client";

import { Button, Flex, Paper, PasswordInput, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  type ConfirmResetPasswordPayload,
  confirmResetPassword,
} from "~/api/auth";

const useConfirmResetPasswordMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ConfirmResetPasswordPayload) =>
      confirmResetPassword(data),
    onSuccess: () => {
      notifications.show({
        title: "Password reset successful",
        message: "Redirecting to login page...",
        color: "green",
      });
      router.push("/auth/login");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        notifications.show({
          title: "Something went wrong",
          message: "Password reset failed...",
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

type FormValues = {
  new_password1: string;
  new_password2: string;
};

interface PasswordResetConfirmProps {
  uid: string;
  token: string;
}

const PasswordResetConfirm = ({ uid, token }: PasswordResetConfirmProps) => {
  const form = useForm({
    initialValues: {
      new_password1: "",
      new_password2: "",
    },
    validate: {
      new_password1: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
      new_password2: (val, values) =>
        val !== values.new_password1 ? "Passwords do not match" : null,
    },
  });

  const mutation = useConfirmResetPasswordMutation();

  const handleSubmit = (values: FormValues) => {
    mutation.mutate({
      uid,
      token,
      ...values,
    });
  };

  return (
    <Paper radius="md" p="xl" miw={{ xs: 320, sm: 400 }} withBorder>
      <Text size="lg" weight={500} align="center" mb="lg">
        {"Change password"}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <PasswordInput
            required
            label="Password"
            placeholder="Enter new password"
            value={form.values.new_password1}
            onChange={(event) =>
              form.setFieldValue("new_password1", event.currentTarget.value)
            }
            error={
              form.errors.new_password1 &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />
          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Enter new password"
            value={form.values.new_password2}
            onChange={(event) =>
              form.setFieldValue("new_password2", event.currentTarget.value)
            }
            error={
              form.errors.new_password2 &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />
        </Stack>

        <Flex mt="xl" align="center" justify="center">
          <Button type="submit" radius="xl" loading={mutation.isLoading}>
            {"Confirm"}
          </Button>
        </Flex>
      </form>
    </Paper>
  );
};

export default PasswordResetConfirm;
