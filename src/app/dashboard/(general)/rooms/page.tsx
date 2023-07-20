import { cookies } from "next/headers";
import type { PaginatedResponseData, Room } from "~/api/types";
import RoomsPage from "~/components/dashboard/rooms/RoomsPage";
import { env } from "~/env.mjs";

export default async function DashboardRoomsPage() {
  const access = cookies().get("access");
  const r = await fetch(`${env.API_URL}/api/rooms/?page=1&page_size=10`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access?.value || ""}`,
    },
    next: {
      revalidate: 30,
    },
  });
  const data = (await r.json()) as PaginatedResponseData<Room>;
  const results = data.results;
  return <RoomsPage initialData={results} count={data.count} />;
}
