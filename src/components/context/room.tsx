import { useContext, createContext } from "react";
import type {
  BeerObject,
  ChatMessageObject,
  RatingsObject,
  UserObject,
  UserRatingsObject,
} from "~/api/types";

interface RoomContextType {
  // todo: extend room state to avoid code duplication
  token: string;
  roomName: string;
  isHost: boolean;
  messages: ChatMessageObject[];
  beers: BeerObject[];
  users: UserObject[];
  state: string;
  results: RatingsObject[];
  userResults: UserRatingsObject[];
}

const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const useRoom = () => useContext(RoomContext);

export const RoomContextProvider = RoomContext.Provider;
