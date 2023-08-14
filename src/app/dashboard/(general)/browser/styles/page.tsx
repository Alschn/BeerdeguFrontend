import { cookies } from "next/headers";
import type { BeerStyle, PaginatedResponseData } from "~/api/types";
import BeerStylesPage from "~/components/dashboard/browser/BeerStylesPage";
import { env } from "~/env.mjs";

const BEER_STYLES_PAGE_SIZE = 10;

export default async function DashboardBrowserStylesPage() {
  const access = cookies().get("access");
  const r = await fetch(
    `${env.API_URL}/api/styles/?page=1&page_size=${BEER_STYLES_PAGE_SIZE}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access?.value || ""}`,
      },
      next: {
        revalidate: 60,
      },
    }
  );
  const data = (await r.json()) as PaginatedResponseData<BeerStyle>;

  return <BeerStylesPage initialData={data} />;
}
