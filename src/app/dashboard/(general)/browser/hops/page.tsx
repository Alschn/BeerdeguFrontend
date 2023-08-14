import { cookies } from "next/headers";
import type { Hop, PaginatedResponseData } from "~/api/types";
import HopsPage from "~/components/dashboard/browser/HopsPage";
import { env } from "~/env.mjs";

const HOPS_PAGE_SIZE = 10;

export default async function DashboardBrowserHopsPage() {
  const access = cookies().get("access");
  const r = await fetch(
    `${env.API_URL}/api/hops/?page=1&page_size=${HOPS_PAGE_SIZE}`,
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
  const data = (await r.json()) as PaginatedResponseData<Hop>;

  return <HopsPage initialData={data} />;
}
