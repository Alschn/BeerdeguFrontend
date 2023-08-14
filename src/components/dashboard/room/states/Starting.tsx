import { Box, Title } from "@mantine/core";
import { useEffect } from "react";
import { useRoom } from "~/components/context/room";
import ParticipantView from "../StartingParticipantView";
import HostView from "../StartingHostView";

const Starting = () => {
  const { isHost, state, sendJsonMessage } = useRoom();

  useEffect(() => {
    sendJsonMessage({ command: "load_beers" });
  }, [sendJsonMessage]);

  return (
    <Box>
      <Title order={2} align="center">
        State: {state}
      </Title>

      {isHost ? <HostView /> : <ParticipantView />}
    </Box>
  );
};

export default Starting;
