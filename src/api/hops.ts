import { axiosPublicClient } from "./AxiosClient";
import type {
  Hop,
  PageNumberPaginationParams,
  PaginatedResponseData,
} from "./types";

export interface HopsParams extends PageNumberPaginationParams {
  name__icontains?: string;
  country__icontains?: string;
}

export const getHops = (params?: HopsParams) => {
  return axiosPublicClient.get<PaginatedResponseData<Hop>>("/api/hops/", {
    params,
  });
};
