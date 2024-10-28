"use server";

import { cookies } from "next/headers";
import type { BeerPurchase, PaginatedResponseData } from "~/api/types";
import { env } from "~/env.mjs";
import { stringifyParams } from "~/utils/query-params";

export interface PurchasesParams {
  page?: number;
  page_size?: number;
  packaging?: string;
  price?: number;
  price__gte?: number;
  price__lte?: number;
  volume_ml?: number;
  volume_ml__gte?: number;
  volume_ml__lte?: number;
  purchased_at?: string;
  purchased_at__gte?: string;
  purchased_at__lte?: string;
  search?: string;
  ordering?: string;
}

export async function getPurchases({
  page = 1,
  page_size = 10,
  ...rest
}: PurchasesParams) {
  const access = (await cookies()).get("access");

  const paramsToString = stringifyParams({ page, page_size, ...rest });
  const params = new URLSearchParams(paramsToString);
  const queryParams = params.toString();

  const r = await fetch(`${env.API_URL}/api/beer-purchases/?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access?.value || ""}`,
    },
  });
  const data = (await r.json()) as PaginatedResponseData<BeerPurchase>;
  return data;
}
