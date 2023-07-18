import { axiosPublicClient } from "./AxiosClient";
import type { Beer, PaginatedResponseData } from "./types";

type GetBeersParams = {
  search?: string;
  page?: number;
  page_size?: number;
};

export const getBeers = (params?: GetBeersParams) => {
  return axiosPublicClient.get<PaginatedResponseData<Beer>>("/api/beers/", {
    params,
  });
};
