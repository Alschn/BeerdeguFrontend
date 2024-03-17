"use server";

import { cookies } from "next/headers";
import type { BeerPurchase, PaginatedResponseData } from "~/api/types";
import { env } from "~/env.mjs";

interface PurchasesParams {
  page?: number;
  page_size?: number;
  [key: string]: unknown;
}

export async function getPurchases({
  page = 1,
  page_size = 10,
}: PurchasesParams) {
  const access = cookies().get("access");

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: page_size.toString(),
  });
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
