import { axiosGatewayClient } from "./AxiosClient";

export interface CreatePurchasePayload {
  beer: number;
  packaging: string;
  price: number;
  volume_ml: number;
  purchased_at: string;
}

// todo: change to next action (?)
export const createPurchase = (data: CreatePurchasePayload) => {
  return axiosGatewayClient.post<unknown>("/api/beer-purchases/", data);
};
