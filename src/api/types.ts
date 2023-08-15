import { type AxiosResponse } from "axios";
import { ReadyState } from "react-use-websocket";

export type Response<T> = AxiosResponse<T>;

export type PaginatedResponseData<T> = {
  count: number;
  previous: string | null;
  next: string | null;
  results: T[];
};

export type PaginatedResponse<T> = Response<PaginatedResponseData<T>>;

export type PageNumberPaginationParams = {
  page?: number;
  page_size?: number;
};

type Nullable<T> = T | null;

export interface User {
  id: number;
  username: string;
  email: string;
}

export const RoomStates = {
  WAITING: "WAITING",
  STARTING: "STARTING",
  IN_PROGRESS: "IN_PROGRESS",
  FINISHED: "FINISHED",
} as const;

export type RoomState = (typeof RoomStates)[keyof typeof RoomStates];

export interface Room {
  id: number;
  name: string;
  has_password: boolean;
  host: User;
  slots: number;
  state: RoomState;
  created_at: string;
  updated_at: string;
  users_count: number;
}

export interface RoomDetail extends Room {
  users: User[];
  beers: Beer[];
}

export interface Beer {
  id: number;
  name: string;
  brewery: Brewery;
  style: BeerStyle;
  hops: Hop[];
  percentage: number;
  volume_ml: number;
  extract: Nullable<number>;
  IBU: Nullable<number>;
  hop_rate: Nullable<number>;
  image: Nullable<string>;
  description: string;
}

export interface BeerDetail {
  id: number;
  name: string;
  brewery: BreweryEmbedded;
  style: BeerStyleEmbedded;
  hops: HopEmbedded[];
  percentage: number;
  volume_ml: number;
  extract: Nullable<number>;
  IBU: Nullable<number>;
  hop_rate: Nullable<number>;
  image: Nullable<string>;
  description: string;
}

export interface BreweryEmbedded {
  id: number;
  name: string;
}

export interface HopEmbedded {
  id: number;
  name: string;
}

export interface BeerStyleEmbedded {
  id: number;
  name: string;
}

export interface BeerSimplified {
  id: number;
  image: string | null;
  name: string;
  brewery: string;
  style: string;
}

export interface UserRating {
  color: string;
  smell: string;
  foam: string;
  taste: string;
  opinion: string;
  note: number;
}

export interface Hop {
  id: number;
  name: string;
  country: string;
  description: string;
}

export interface HopDetail {
  id: number;
  name: string;
  country: string;
  description: string;
}

type NumberRangeField = {
  // decimals are returned as strings
  lower: string;
  upper: string;
  bounds: "[)";
};

export interface BeerStyle {
  id: number;
  name: string;
  known_as: string | null;
  country: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface BeerStyleDetail extends BeerStyle {
  serving_temperature_range: NumberRangeField | null;
  abv_range: NumberRangeField | null;
  color_range: NumberRangeField | null;
  bitterness_range: NumberRangeField | null;
  original_gravity_range: NumberRangeField | null;
  final_gravity_range: NumberRangeField | null;
}

export interface Brewery {
  id: number;
  name: string;
  city: string;
  country: string;
  year_established: number | null;
  image: string | null;
  website: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface BreweryDetail {
  id: number;
  name: string;
  city: string;
  country: string;
  established: string;
  description: string;
}

type BeerInRating = BeerSimplified;

export interface Rating {
  id: number;
  added_by: User;
  beer: BeerInRating;
  room: Room;
  color: string | null;
  foam: string | null;
  smell: string | null;
  taste: string | null;
  opinion: string | null;
  note: number | null;
  created_at: string;
  updated_at: string;
}

export interface RatingDetail {
  id: number;
  added_by: User;
  beer: BeerDetail;
  room: Room;
  color: string | null;
  foam: string | null;
  smell: string | null;
  taste: string | null;
  opinion: string | null;
  note: number | null;
  created_at: string;
  updated_at: string;
}

export const WebsocketConnectionState = {
  [ReadyState.CONNECTING]: "Connecting",
  [ReadyState.OPEN]: "Open",
  [ReadyState.CLOSING]: "Closing",
  [ReadyState.CLOSED]: "Closed",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
} as const;

export interface UserObject {
  id: string | number;
  username: string;
}

export interface BeerObject {
  id: number;
  name: string;
  percentage: number;
  volume_ml: number;
  extract: number;
  IBU: number;
  hop_rate: number;
  image: string | null;
  description: string | null;
  brewery: string;
  style: string;
  hops: number[];
}

export interface SimplifiedBeerObject {
  name: string;
  brewery: string;
  style: string;
}

export interface RatingsObject {
  order: number;
  beer: SimplifiedBeerObject;
  average_rating: number;
}

export interface UserRatingsObject {
  color: string;
  smell: string;
  foam: string;
  taste: string;
  opinion: string;
  note: number;
}

export const Commands = {
  SET_NEW_MESSAGE: "set_new_message",
  SET_USERS: "set_users",
  SET_BEERS: "set_beers",
  SET_FORM_DATA: "set_form_data",
  SET_ROOM_STATE: "set_room_state",
  SET_FINAL_RESULTS: "set_final_results",
  SET_USER_RESULTS: "set_user_results",
  USER_JOIN: "user_join",
  USER_LEAVE: "user_leave",
  USER_DISCONNECT: "user_disconnect",
} as const;

export type CommandType = (typeof Commands)[keyof typeof Commands];

export interface WebsocketMessage {
  data: unknown; // todo: type every command with its content
  command: CommandType;
  timestamp: string;
}

export interface ChatMessageObject {
  message: string;
  user: string;
}
