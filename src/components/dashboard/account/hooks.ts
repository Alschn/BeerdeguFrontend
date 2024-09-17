import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { type ChangePasswordPayload, changePassword } from "~/api/auth";
import { isApiError, APIError } from "~/api/errors";

interface UsePasswordChangeMutationOptions {
  onSuccess?: (
    data?: unknown,
    variables?: ChangePasswordPayload,
    context?: unknown
  ) => void;
  onError?: (
    error?: unknown,
    variables?: ChangePasswordPayload,
    context?: unknown
  ) => void;
}

export const usePasswordChangeMutation = (
  options?: UsePasswordChangeMutationOptions
) => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
    onSuccess: (data, variables, context) => {
      notifications.show({
        title: "Password changed",
        message: "Your password has been changed",
        color: "green",
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error) => {
      if (!isApiError(error)) {
        notifications.show({
          title: "Something went wrong!",
          message: "Try again later...",
          color: "red",
        });
        return;
      }
      const _err = APIError.fromAxiosError(error);
      // todo: handle validation errors
      notifications.show({
        title: "Password change failed",
        message: "Make sure you entered correct password",
        color: "red",
      });
    },
  });
};
