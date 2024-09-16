import {
  Card,
  Stack,
  PasswordInput,
  Center,
  Button,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { type ChangePasswordPayload } from "~/api/auth";
import { usePasswordChangeMutation } from "./hooks";
import {
  passwordChangeSchema,
  NEW_PASSWORD_MIN_LENGTH_MESSAGE,
  NEW_PASSWORD_MIN_LENGTH,
} from "./schema";

const ChangePasswordCard = () => {
  const form = useForm({
    initialValues: {
      old_password: "",
      new_password1: "",
      new_password2: "",
    },
    validate: zodResolver(passwordChangeSchema),
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
            {...form.getInputProps("old_password")}
            name="old_password"
            label="Old password"
            placeholder="Old password"
            required
          />
          <PasswordInput
            {...form.getInputProps("new_password1")}
            name="new_password1"
            label="New password"
            placeholder="New password"
            description={NEW_PASSWORD_MIN_LENGTH_MESSAGE}
            minLength={NEW_PASSWORD_MIN_LENGTH}
            required
          />
          <PasswordInput
            {...form.getInputProps("new_password2")}
            name="new_password2"
            label="Confirm new password"
            placeholder="Confirm new password"
            description={NEW_PASSWORD_MIN_LENGTH_MESSAGE}
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

export default ChangePasswordCard;
