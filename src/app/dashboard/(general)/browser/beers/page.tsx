import { cookies } from "next/headers";
import type { Beer, PaginatedResponseData } from "~/api/types";
import { env } from "~/env.mjs";

export default async function DashboardBrowserBeersPage() {
  const access = cookies().get("access");
  const r = await fetch(`${env.API_URL}/api/beers/?page=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access?.value || ""}`,
    },
    // next: {
    //   revalidate: 30,
    // },
  });
  const data = (await r.json()) as PaginatedResponseData<Beer>;
  const results = data.results;

  return (
    <div>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
