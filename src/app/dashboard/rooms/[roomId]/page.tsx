import { cookies } from "next/headers";
import RoomPage from "~/components/dashboard/room/RoomPage";
import { env } from "~/env.mjs";

interface RouteProps {
  params: {
    roomId: string;
  };
}

interface IsInRoomResponse {
  message: string;
  is_host: boolean;
  token: string;
}

const DashboardRoomsRoomPage = async ({ params }: RouteProps) => {
  const access = cookies().get("access");
  const r = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/rooms/${params.roomId}/in/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: access ? `Bearer ${access.value}` : "",
      },
      cache: "no-store",
    }
  );

  if (!r.ok) throw new Error(String(r.status));

  const data = (await r.json()) as IsInRoomResponse;

  return (
    <RoomPage roomId={params.roomId} isHost={data.is_host} token={data.token} />
  );
};

export default DashboardRoomsRoomPage;
