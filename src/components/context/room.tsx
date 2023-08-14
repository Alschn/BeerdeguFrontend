import { useContext, createContext } from "react";
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import type {
  BeerObject,
  ChatMessageObject,
  RatingsObject,
  UserObject,
  UserRatingsObject,
} from "~/api/types";

interface RoomContextType {
  // todo: extend room state to avoid code duplication
  // todo (?): maybe move websockets related stuff to separate context
  token: string;
  websocketUrl: string;
  roomName: string;
  isHost: boolean;
  messages: ChatMessageObject[];
  beers: BeerObject[];
  users: UserObject[];
  state: string;
  results: RatingsObject[];
  userResults: UserRatingsObject[];
  sendJsonMessage: SendJsonMessage;
}

const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const useRoom = () => useContext(RoomContext);

export const RoomContextProvider = RoomContext.Provider;
