import { cookies } from "next/headers";
import type { PaginatedResponseData, Room } from "~/api/types";
import RoomsPage from "~/components/dashboard/rooms/RoomsPage";
import { env } from "~/env.mjs";

const ROOMS_PAGE_SIZE = 10;

export default async function DashboardRoomsPage() {
  const access = cookies().get("access");
  const r = await fetch(
    `${env.API_URL}/api/rooms/?page=1&page_size=${ROOMS_PAGE_SIZE}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access?.value || ""}`,
      },
    }
  );
  const data = (await r.json()) as PaginatedResponseData<Room>;

  return <RoomsPage initialData={data} />;
}
