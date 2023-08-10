import { axiosGatewayClient } from "./AxiosClient";
import type {
  PaginatedResponseData,
  PageNumberPaginationParams,
  Rating,
  RatingDetail,
} from "./types";

type RatingsOrdering =
  | "id"
  | "-id"
  | "created_at"
  | "-created_at"
  | "updated_at"
  | "-updated_at";

export interface RatingsParams extends PageNumberPaginationParams {
  beer?: number;
  beer__in?: string;
  room?: number;
  room__in?: string;
  added_by?: number;
  added_by__in?: string;
  note?: number;
  note__gte?: number;
  note__lte?: number;
  note__gt?: number;
  note__lt?: number;
  note__range?: string;
  created_at__gte?: string;
  created_at__lte?: string;
  updated_at__gte?: string;
  updated_at__lte?: string;
  ordering?: RatingsOrdering;
  search?: string;
}

export const getRatings = (params?: RatingsParams) => {
  return axiosGatewayClient.get<PaginatedResponseData<Rating>>(
    "/api/ratings/",
    {
      params,
    }
  );
};

export const getRating = (id: number) => {
  return axiosGatewayClient.get<RatingDetail>(`/api/ratings/${id}/`);
};

export interface CreateRatingPayload {
  beer: number;
  color: string;
  foam: string;
  smell: string;
  taste: string;
  opinion: string;
  note: number | null;
}

export const createRating = (payload: CreateRatingPayload) => {
  return axiosGatewayClient.post<unknown>("/api/ratings/", payload);
};

export type UpdateRatingPayload = Partial<Omit<CreateRatingPayload, "beer">>;

export const updateRating = (id: number, payload: UpdateRatingPayload) => {
  return axiosGatewayClient.patch<unknown>(`/api/ratings/${id}/`, payload);
};

export const deleteRating = (id: number) => {
  return axiosGatewayClient.delete<Record<string, never>>(
    `/api/ratings/${id}/`
  );
};
