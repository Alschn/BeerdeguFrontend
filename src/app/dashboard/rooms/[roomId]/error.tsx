"use client";

import { Container } from "@mantine/core";
import { useRouter } from "next/navigation";

const UserNotInRoom = () => {
  const router = useRouter();

  return (
    <div>
      <h1>403 | Forbidden</h1>
      <h2>User is not in this room</h2>
      <button onClick={() => router.push("/dashboard")}>
        Back to dashboard
      </button>
    </div>
  );
};

const RoomNotFound = () => {
  return (
    <div>
      <h1>404 | Not found</h1>
      <button>Back to home page</button>
    </div>
  );
};

const DefaultError = ({ reset }: { reset: () => void }) => {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
};

export default function RoomPageError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  let component: JSX.Element;
  switch (error.message) {
    case "403":
      component = <UserNotInRoom />;
      break;

    case "404":
      component = <RoomNotFound />;
      break;

    default:
      component = <DefaultError reset={reset} />;
      break;
  }
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {component}
    </Container>
  );
}
