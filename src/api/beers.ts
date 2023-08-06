import { axiosPublicClient } from "./AxiosClient";
import type { Beer, PaginatedResponseData } from "./types";

export type BeersParams = {
  page?: number;
  page_size?: number;
  search?: string;
  name__icontains?: string;
  brewery__in?: string;
  brewery__name?: string;
  style__in?: string;
  style__name?: string;
  percentage__gte?: number;
  percentage__lte?: number;
  percentage__range?: string;
  percentage?: number;
  volume_ml__gte?: number;
  volume_ml__lte?: number;
  volume_ml__range?: string;
  volume_ml?: number;
  hop_rate__gte?: number;
  hop_rate__lte?: number;
  hop_rate__range?: string;
  hop_rate?: number;
  IBU__gte?: number;
  IBU__lte?: number;
  IBU__range?: string;
  IBU?: number;
  hops__in?: string;
  hops__name__icontains?: string;
};

export const getBeers = (params?: BeersParams) => {
  return axiosPublicClient.get<PaginatedResponseData<Beer>>("/api/beers/", {
    params,
  });
};
