import { axiosPublicClient } from "./AxiosClient";
import type {
  BeerStyle,
  PageNumberPaginationParams,
  PaginatedResponseData,
} from "./types";

export interface BeerStylesParams extends PageNumberPaginationParams {
  search?: string;
  name__icontains?: string;
}

export const getBeerStyles = (params?: BeerStylesParams) => {
  return axiosPublicClient.get<PaginatedResponseData<BeerStyle>>(
    "/api/styles/",
    { params }
  );
};
