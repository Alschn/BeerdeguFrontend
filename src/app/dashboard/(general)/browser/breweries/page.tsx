import { cookies } from "next/headers";
import type { Brewery, PaginatedResponseData } from "~/api/types";
import BreweriesPage from "~/components/dashboard/browser/BreweriesPage";
import { env } from "~/env.mjs";

const BREWERIES_PAGE_SIZE = 10;

export default async function DashboardBrowserBreweriesPage() {
  const access = cookies().get("access");
  const r = await fetch(`${env.API_URL}/api/breweries/?page=1&page_size=${BREWERIES_PAGE_SIZE}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access?.value || ""}`,
    },
    next: {
      revalidate: 60,
    },
  });
  const data = (await r.json()) as PaginatedResponseData<Brewery>;

  return <BreweriesPage initialData={data} />;
}
