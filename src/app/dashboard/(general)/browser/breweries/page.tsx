import { cookies } from "next/headers";
import type { Brewery, PaginatedResponseData } from "~/api/types";
import { env } from "~/env.mjs";

export default async function DashboardBrowserBreweriesPage() {
  const access = cookies().get("access");
  const r = await fetch(`${env.API_URL}/api/breweries/?page=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access?.value || ""}`,
    },
    // next: {
    //   revalidate: 60,
    // },
  });
  const data = (await r.json()) as PaginatedResponseData<Brewery>;
  const results = data.results;

  return (
    <div>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
