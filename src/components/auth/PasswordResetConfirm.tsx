"use client";

import { Button, Flex, Paper, PasswordInput, Stack, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  confirmResetPassword,
  type ConfirmResetPasswordPayload,
} from "~/api/auth";
import { APIError, isApiError } from "~/api/errors";

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
      if (!isApiError(error)) {
        notifications.show({
          title: "Something went wrong",
          message: "Please try again later...",
          color: "red",
        });
        return;
      }

      const _err = APIError.fromAxiosError(error);
      // todo: handle error messages
      notifications.show({
        title: "Something went wrong",
        message: "Password reset failed...",
        color: "red",
      });
    },
  });
};

type FormValues = {
  new_password1: string;
  new_password2: string;
};

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MIN_LENGTH_MESSAGE = `Password should include at least ${PASSWORD_MIN_LENGTH} characters`;
const PASSWORDS_DO_NOT_MATCH_MESSAGE = "Passwords do not match";

const passwordResetConfirmSchema = z
  .object({
    new_password1: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
    new_password2: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    path: ["new_password2"],
    message: PASSWORDS_DO_NOT_MATCH_MESSAGE,
  });

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
    validate: zodResolver(passwordResetConfirmSchema),
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
            {...form.getInputProps("new_password1")}
            name="password"
            label="Password"
            placeholder="Enter new password"
            description={PASSWORD_MIN_LENGTH_MESSAGE}
            minLength={PASSWORD_MIN_LENGTH}
            radius="md"
            required
          />
          <PasswordInput
            {...form.getInputProps("new_password2")}
            label="Confirm Password"
            placeholder="Enter new password"
            description={PASSWORD_MIN_LENGTH_MESSAGE}
            minLength={PASSWORD_MIN_LENGTH}
            radius="md"
            required
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
