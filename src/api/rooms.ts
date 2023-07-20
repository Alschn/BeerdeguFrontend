import { axiosGatewayClient } from "./AxiosClient";
import type {
  Beer,
  PaginatedResponse,
  PaginatedResponseData,
  Room,
} from "./types";

export const addBeerToRoom = (roomName: string, beerId: number) => {
  return axiosGatewayClient.put<Beer>(`/api/rooms/${roomName}/beers/`, {
    beer_id: beerId,
  });
};

export const removeBeerFromRoom = (roomName: string, beerId: number) => {
  return axiosGatewayClient.delete(`/api/rooms/${roomName}/beers/`, {
    params: {
      beer_id: beerId,
    },
  });
};

export const joinRoom = (roomName: string, password: string) => {
  return axiosGatewayClient.put<unknown>(`/api/rooms/${roomName}/join/`, {
    password,
  });
};

export type CreateRoomPayload = {
  name: string;
  password: string;
  slots: number;
};

type CreateRoomBody = {
  name: string;
  host: string;
  password: string;
  slots: number;
};

export const createRoom = (payload: CreateRoomPayload) => {
  return axiosGatewayClient.post<CreateRoomBody>(`/api/rooms/`, payload);
};

export const leaveRoom = (roomName: string) => {
  return axiosGatewayClient.delete<Record<string, never>>(
    `/api/rooms/${roomName}/leave/`
  );
};

interface RoomsFilters {
  page?: number;
  page_size?: number;
  // todo: add more filters
}

export const getRooms = (params?: RoomsFilters) => {
  return axiosGatewayClient.get<PaginatedResponseData<Room>>(`/api/rooms/`, {
    params,
  });
};
