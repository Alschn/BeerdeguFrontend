import { cookies } from "next/headers";
import type { Hop, PaginatedResponseData } from "~/api/types";
import { env } from "~/env.mjs";

export default async function DashboardBrowserHopsPage() {
  const access = cookies().get("access");
  const r = await fetch(`${env.API_URL}/api/hops/?page=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access?.value || ""}`,
    },
    // next: {
    //   revalidate: 60,
    // },
  });
  const data = (await r.json()) as PaginatedResponseData<Hop>;
  const results = data.results;

  return (
    <div>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
