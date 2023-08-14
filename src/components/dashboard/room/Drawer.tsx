import { Drawer, Flex, type DrawerProps, Divider, Title } from "@mantine/core";
import NextLink from "next/link";
import { type RoomState, RoomStates, Commands } from "~/api/types";
import BeerdeguLogo from "~/components/BeerdeguLogo";
import { useRoom } from "~/components/context/room";
import ControlButton from "../ControlButton";
import ParticipantsList from "./ParticipantsList";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { leaveRoom } from "~/api/rooms";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "~/components/context/auth";

const RoomDrawer = ({ opened, onClose }: DrawerProps) => {
  const { user } = useAuth();
  const { roomName, state, isHost, sendJsonMessage, users } = useRoom();
  const router = useRouter();

  const getRoomState = () => {
    sendJsonMessage({
      command: "get_room_state",
    });
    onClose();
  };

  const loadBeers = () => {
    sendJsonMessage({
      command: "load_beers",
    });
    onClose();
  };

  const changeRoomState = (newState: RoomState) => {
    sendJsonMessage({
      command: "change_room_state",
      data: newState,
    });
    onClose();
  };

  const getRatingsAndStatistics = () => {
    sendJsonMessage({
      command: "get_user_ratings",
    });
    sendJsonMessage({
      command: "get_final_ratings",
    });
    onClose();
  };

  const leaveRoomMutation = useMutation({
    mutationFn: () => leaveRoom(roomName),
    onSuccess: () => {
      if (user) {
        sendJsonMessage({
          command: Commands.USER_LEAVE,
          data: user.username
        })
      }
      onClose();
      notifications.show({
        title: "Success",
        message: `You have just left the room: ${roomName}`,
        color: "green",
      });
      router.push("/dashboard");
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Could not leave room",
        color: "red",
      });
    },
  });

  const handleLeaveRoom = () => {
    leaveRoomMutation.mutate();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="left"
      size="xs"
      withCloseButton={false}
      closeOnClickOutside
      closeOnEscape
      padding={0}
    >
      <Flex justify="center" pt={16}>
        <NextLink href="/">
          <BeerdeguLogo showText />
        </NextLink>
      </Flex>
      <Divider my={20} />
      <Title order={2} my={20} px={12}>
        Room {roomName}
      </Title>
      {isHost && (
        <>
          <ControlButton onClick={() => getRoomState()}>
            Refresh room details
          </ControlButton>
          {state !== RoomStates.FINISHED && (
            <ControlButton onClick={() => loadBeers()}>
              Load / Refresh beers
            </ControlButton>
          )}
          {state === RoomStates.WAITING && (
            <ControlButton onClick={() => changeRoomState(RoomStates.STARTING)}>
              Go to beers selection
            </ControlButton>
          )}
          {state !== RoomStates.IN_PROGRESS ? (
            <>
              <ControlButton
                onClick={() => changeRoomState(RoomStates.IN_PROGRESS)}
              >
                {state === RoomStates.STARTING || state === RoomStates.STARTING
                  ? "Start"
                  : "Resume"}{" "}
                tasting session
              </ControlButton>
            </>
          ) : (
            <>
              <ControlButton
                onClick={() => changeRoomState(RoomStates.STARTING)}
              >
                Back to beers selection
              </ControlButton>
              <ControlButton
                onClick={() => changeRoomState(RoomStates.FINISHED)}
              >
                End tasting session
              </ControlButton>
            </>
          )}

          {state === RoomStates.FINISHED && (
            <ControlButton onClick={() => getRatingsAndStatistics()}>
              Load statistics
            </ControlButton>
          )}
        </>
      )}

      <Divider />
      <ControlButton onClick={() => handleLeaveRoom()}>
        Leave room
      </ControlButton>
      <Divider mb={20} />

      <Title order={3} px={12} mb={12}>
        State: {state}
      </Title>

      <Title order={3} px={12} mb={12}>
        Participants
      </Title>

      <ParticipantsList data={users} px={12} />
    </Drawer>
  );
};

export default RoomDrawer;
