"use client";

import { Button, Container, Loader, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { type Dispatch, useEffect, useReducer, useState } from "react";
import useWebSocket from "react-use-websocket";
import {
  RoomStates,
  type BeerObject,
  type ChatMessageObject,
  type RatingsObject,
  type Room,
  type RoomState,
  type UserObject,
  type WebsocketMessage,
  type UserRatingsObject,
  Commands,
} from "~/api/types";
import { env } from "~/env.mjs";
import Header from "./Header";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { RoomContextProvider } from "~/components/context/room";
import Main from "./Main";
import Drawer from "./Drawer";
import { useDisclosure } from "@mantine/hooks";
import NextLink from "next/link";
import BeerdeguLogo from "~/components/BeerdeguLogo";

const USER_PING_INTERVAL_MS = 10_000;
const USERS_FETCH_INTERVAL_MS = 10_000;
const TRY_RECONNECT_TIMES = 5;

interface State {
  token: string;
  roomName: string;
  isHost: boolean;
  messages: ChatMessageObject[];
  beers: BeerObject[];
  users: UserObject[];
  state: RoomState;
  // room: Room;
  results: RatingsObject[];
  userResults: UserRatingsObject[];
}

type Action =
  | { type: "set_new_message"; payload: ChatMessageObject }
  | { type: "set_beers"; payload: BeerObject[] }
  | { type: "set_users"; payload: UserObject[] }
  | { type: "set_room_state"; payload: Room }
  | { type: "set_final_results"; payload: RatingsObject[] }
  | { type: "set_user_results"; payload: UserRatingsObject[] };

const roomReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set_new_message":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "set_beers":
      return {
        ...state,
        beers: [...action.payload],
      };
    case "set_users":
      return {
        ...state,
        users: [...action.payload],
      };
    case "set_room_state":
      return {
        ...state,
        // todo: change this
        state: action.payload.state,
        // room: action.payload,
      };
    case "set_final_results":
      return {
        ...state,
        results: [...action.payload],
      };
    case "set_user_results":
      return {
        ...state,
        userResults: [...action.payload],
      };
    default:
      // todo: handle unknown action
      return state;
  }
};

const usePing = (callback: SendJsonMessage, interval_ms = 10000) => {
  useEffect(() => {
    const pingInterval = setInterval(() => {
      callback({
        command: "user_active",
      });
    }, interval_ms);
    return () => clearInterval(pingInterval);
  }, [callback, interval_ms]);
};

const useFetchUsers = (callback: SendJsonMessage, interval_ms = 10000) => {
  useEffect(() => {
    const fetchUsersInterval = setInterval(() => {
      callback({
        command: "get_users",
      });
    }, interval_ms);
    return () => clearInterval(fetchUsersInterval);
  }, [callback, interval_ms]);
};

const useFetchOnStateChange = (state: string, callback: SendJsonMessage) => {
  useEffect(() => {
    if (state === RoomStates.IN_PROGRESS) {
      callback({
        command: "load_beers",
      });
    }

    if (state === RoomStates.FINISHED) {
      callback({
        command: "get_user_ratings",
      });
      callback({
        command: "get_final_ratings",
      });
    }
  }, [state, callback]);
};

const handleMessage =
  (dispatch: Dispatch<Action>) => (event: MessageEvent<unknown>) => {
    const data = event.data as string;
    try {
      const parsed = JSON.parse(data) as WebsocketMessage;
      if (parsed.command === Commands.USER_DISCONNECT) {
        const username = parsed.data as string;
        notifications.show({
          id: `toast-user_disconnect-${username}`,
          title: `${username} has disconnected`,
          message: `User is no longer active in this room`,
          color: "red.6",
          autoClose: 2000
        })
        return;
      }
      if (parsed.command === Commands.USER_LEAVE) {
        const username = parsed.data as string;
        notifications.show({
          id: `toast-user_leave-${username}`,
          title: `${username} has left the room`,
          message: `User is no longer part of this room`,
          color: "yellow",
        })
        return;
      }
      if (parsed.command === Commands.USER_JOIN) {
        const username = parsed.data as string;
        notifications.show({
          id: `toast-user_join-${username}`,
          title: `${username} has joined the room`,
          message: `User can now participate in this session`,
          color: "indigo",
        })
        return;
      }
      dispatch({
        type: parsed.command,
        payload: parsed.data,
      } as Action);
    } catch {
      console.error("Failed to parse websocket message");
    }
  };

const initState = ({
  token,
  roomName,
  isHost,
}: Pick<State, "isHost" | "token" | "roomName">): State => {
  return {
    state: RoomStates.WAITING,
    messages: [],
    beers: [],
    users: [],
    results: [],
    userResults: [],
    token: token,
    roomName: roomName,
    isHost: isHost,
  };
};

interface RoomPageProps {
  roomId: string;
  isHost: boolean;
  token: string;
}

const RoomPage = ({ roomId, isHost, token }: RoomPageProps) => {
  const websocketUrl = `${env.NEXT_PUBLIC_WEBSOCKETS_URL}/room/${roomId}/`;
  const [isConnecting, setIsConnecting] = useState(true);
  const [failedToConnect, setFailedToConnect] = useState(false);

  const [state, dispatch] = useReducer(
    roomReducer,
    { roomName: roomId, token, isHost },
    initState
  );

  const { sendJsonMessage } = useWebSocket(websocketUrl, {
    queryParams: {
      token,
    },
    onOpen: () => {
      setIsConnecting(false);
      setFailedToConnect(false);
      notifications.show({
        title: "Connection open!",
        message: `Successfully connected to room ${roomId}`,
        color: "green",
        autoClose: 3000,
      });
    },
    onClose: (event) => {
      console.log(`'Connection closed with code: ${event.code}`);
    },
    onMessage: handleMessage(dispatch),
    onReconnectStop: () => {
      setIsConnecting(false);
      setFailedToConnect(true);
      notifications.show({
        message: `Could not establish connection!`,
        color: "red",
      });
    },
    shouldReconnect: () => true,
    retryOnError: true,
    reconnectAttempts: TRY_RECONNECT_TIMES,
    reconnectInterval: 2000,
    share: true,
  });

  const [isDrawerOpen, { close: closeDrawer, toggle: toggleDrawer }] =
    useDisclosure(false);

  usePing(sendJsonMessage, USER_PING_INTERVAL_MS);

  useFetchUsers(sendJsonMessage, USERS_FETCH_INTERVAL_MS);

  useFetchOnStateChange(state.state, sendJsonMessage);

  if (isConnecting)
    return (
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Loader color="orange" variant="dots" size="xl" />
      </Container>
    );

  if (failedToConnect)
    return (
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 16
        }}
      >
        <BeerdeguLogo showText={false} height={100}/>
        <Title order={1}>Failed to connect...</Title>
        <Button color="orange" onClick={() => window.location.reload()} miw={160}>
          Refresh
        </Button>
        <NextLink href="/dashboard/rooms">
          <Button color="orange" variant="outline" miw={160}>
            Back to Dashboard
          </Button>
        </NextLink>
      </Container>
    );

  return (
    <RoomContextProvider value={{ ...state, sendJsonMessage, websocketUrl }}>
      <Header isDrawerOpen={isDrawerOpen} onDrawerToggle={toggleDrawer} />
      <Drawer opened={isDrawerOpen} onClose={closeDrawer} />
      <Main />
    </RoomContextProvider>
  );
};

export default RoomPage;
