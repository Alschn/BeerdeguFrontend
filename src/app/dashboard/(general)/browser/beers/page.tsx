import { cookies } from "next/headers";
import type { Beer, PaginatedResponseData } from "~/api/types";
import BeersPage from "~/components/dashboard/browser/BeersPage";
import { env } from "~/env.mjs";

const BEERS_PAGE_SIZE = 24;

export default async function DashboardBrowserBeersPage() {
  const access = cookies().get("access");
  const r = await fetch(
    `${env.API_URL}/api/beers/?page=1&page_size=${BEERS_PAGE_SIZE}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access?.value || ""}`,
      },
      next: {
        revalidate: 30,
      },
    }
  );
  const data = (await r.json()) as PaginatedResponseData<Beer>;

  return <BeersPage initialData={data} />;
}
