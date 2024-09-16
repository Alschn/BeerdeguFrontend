import {
  Card,
  CardSection,
  Center,
  Avatar,
  Divider,
  Stack,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { useAuth } from "~/components/context/auth";

const AccountDetailsCard = () => {
  const { user } = useAuth();
  const username = user?.username;
  const email = user?.email;

  // todo: mutation, update avatar, update data

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
          readOnly
        />
        <TextInput
          name="email"
          label="Email"
          placeholder="Email"
          value={email}
          readOnly
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

export default AccountDetailsCard;
