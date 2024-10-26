import RoomJoinForm from "~/components/dashboard/rooms/RoomJoinForm";

export default function DashboardRoomJoinPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // todo: token in query parameters
  return <RoomJoinForm />;
}
