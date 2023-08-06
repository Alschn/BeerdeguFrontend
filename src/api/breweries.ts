import { axiosPublicClient } from "./AxiosClient";
import type {
  Brewery,
  PageNumberPaginationParams,
  PaginatedResponseData,
} from "./types";

interface BreweriesParams extends PageNumberPaginationParams {
  name__icontains?: string;
  city__icontains?: string;
  country__icontains?: string;
}

export const getBreweries = (params?: BreweriesParams) => {
  return axiosPublicClient.get<PaginatedResponseData<Brewery>>(
    "/api/breweries/",
    {
      params,
    }
  );
};
