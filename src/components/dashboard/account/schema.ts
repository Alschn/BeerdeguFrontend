import { z } from "zod";

export const NEW_PASSWORD_MIN_LENGTH = 6;
export const NEW_PASSWORD_MIN_LENGTH_MESSAGE = `New password must be at least ${NEW_PASSWORD_MIN_LENGTH} characters long`;
const PASSWORDS_DO_NOT_MATCH_MESSAGE = "Passwords do not match";
const PASSWORDS_OLD_REUSED_MESSAGE =
  "New password cannot be the same as the old password";

export const passwordChangeSchema = z
  .object({
    old_password: z.string().min(1, "Password is required"),
    new_password1: z
      .string()
      .min(NEW_PASSWORD_MIN_LENGTH, NEW_PASSWORD_MIN_LENGTH_MESSAGE),
    new_password2: z
      .string()
      .min(NEW_PASSWORD_MIN_LENGTH, NEW_PASSWORD_MIN_LENGTH_MESSAGE),
  })
  .refine((data) => data.new_password1 === data.new_password2, {
    path: ["new_password2"],
    message: PASSWORDS_DO_NOT_MATCH_MESSAGE,
  })
  .refine((data) => data.old_password !== data.new_password1, {
    path: ["new_password1"],
    message: PASSWORDS_OLD_REUSED_MESSAGE,
  });
