import { Stack, Title } from "@mantine/core";
import ParticipantsList from "../ParticipantsList";
import { useRoom } from "~/components/context/room";

const Waiting = () => {
  const { users } = useRoom();

  return (
    <Stack align="center">
      <Title order={1}>
        Waiting for users to join...
      </Title>
      <ParticipantsList data={users} size="xl" />
    </Stack>
  );
};

export default Waiting;
