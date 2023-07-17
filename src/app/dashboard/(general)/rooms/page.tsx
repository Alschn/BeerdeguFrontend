import { cookies } from "next/headers";
import type { PaginatedResponseData, Room } from "~/api/types";
import RoomsTable from "~/components/dashboard/RoomsTable";
import { env } from "~/env.mjs";

export default async function DashboardRoomsPage() {
  const access = cookies().get("access");
  const r = await fetch(`${env.API_URL}/api/rooms/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access?.value || ""}`,
    },
    cache: "no-cache",
  });
  const data = (await r.json()) as PaginatedResponseData<Room>;
  const results = data.results;

  return (
    <div>
      <RoomsTable initialData={results} />
    </div>
  );
}
