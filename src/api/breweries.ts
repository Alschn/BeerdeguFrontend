import { axiosPublicClient } from "./AxiosClient";
import type {
  Brewery,
  PageNumberPaginationParams,
  PaginatedResponseData,
} from "./types";

export interface BreweriesParams extends PageNumberPaginationParams {
  name__icontains?: string;
  city__icontains?: string;
  country__icontains?: string;
  search?: string;
}

export const getBreweries = (params?: BreweriesParams) => {
  return axiosPublicClient.get<PaginatedResponseData<Brewery>>(
    "/api/breweries/",
    {
      params,
    }
  );
};
