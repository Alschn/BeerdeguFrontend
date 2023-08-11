import { cookies } from "next/headers";
import type { PaginatedResponseData, Rating } from "~/api/types";
import RatingsPage from "~/components/dashboard/ratings/RatingsPage";
import { env } from "~/env.mjs";

const RATINGS_PAGE_SIZE = 10;

export default async function DashboardRatingsPage() {
  const access = cookies().get("access");
  const r = await fetch(
    `${env.API_URL}/api/ratings/?page=1&page_size=${RATINGS_PAGE_SIZE}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access?.value || ""}`,
      },
    }
  );
  const data = (await r.json()) as PaginatedResponseData<Rating>;

  return <RatingsPage initialData={data} />;
}
