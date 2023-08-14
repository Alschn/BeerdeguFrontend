import RoomJoinForm from "~/components/dashboard/rooms/RoomJoinForm";

export default function DashboardRoomJoinPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // todo: token in query parameters
  return <RoomJoinForm />;
}
