import { cookies } from "next/headers";
import RoomPage from "~/components/dashboard/room/RoomPage";
import { env } from "~/env.mjs";

interface IsInRoomResponse {
  message: string;
  is_host: boolean;
  token: string;
}

interface RouteProps {
  params: Promise<{
    roomId: string;
  }>;
}

const DashboardRoomsRoomPage = async (props: RouteProps) => {
  const params = await props.params;
  const roomName = params.roomId.toLowerCase();
  const access = (await cookies()).get("access");
  const r = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/api/rooms/${roomName}/in/`,
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
    <RoomPage roomId={roomName} isHost={data.is_host} token={data.token} />
  );
};

export default DashboardRoomsRoomPage;
