"use client";

import { Button, Container, Flex, Stack, Title } from "@mantine/core";
import { useParams } from "next/navigation";
import BeerdeguLogo from "~/components/BeerdeguLogo";
import NextLink from "next/link";
import type { ReactNode } from "react";

interface ErrorLayoutProps {
  title?: string;
  children?: ReactNode;
}

const ErrorLayout = ({title, children}: ErrorLayoutProps) => {
  return (
    <Stack spacing={16} align="center">
      <BeerdeguLogo showText={false} height={100}/>
      {!!title && (
        <Title order={1}>{title}</Title>
      )}
      {children}
    </Stack>
  )
};

const UserNotInRoom = () => {
  const params = useParams();
  const { roomId } = params;
  const roomName = roomId as string ?? "";

  return (
    <ErrorLayout title="User is not in this room...">
      <Flex gap={16} direction={{base: "column", sm: "row"}}>
        <Button color="orange" onClick={() => window.location.reload()} miw={160}>
          Refresh
        </Button>
        <NextLink href={`/dashboard/rooms/join?name=${roomName}`}>
          <Button color="orange.5" miw={160}>
            Join Room
          </Button>
        </NextLink>
        <NextLink href="/dashboard/rooms">
          <Button color="yellow" variant="outline" miw={160}>
            Back to Dashboard
          </Button>
        </NextLink>
      </Flex>
    </ErrorLayout>
  );
};

const RoomNotFound = () => {
  return (
    <ErrorLayout title="Room not found...">
      <Flex gap={16} direction={{base: "column", sm: "row"}}>
        <NextLink href="/">
          <Button color="orange" miw={160}>
            Back to Home
          </Button>
        </NextLink>
        <NextLink href="/dashboard/rooms">
          <Button color="yellow" variant="outline" miw={160}>
            Back to Dashboard
          </Button>
        </NextLink>
      </Flex>
    </ErrorLayout>
  );
};

const DefaultError = ({ reset }: { reset: () => void }) => {
  return (
    <ErrorLayout title="Something went wrong...">
      <Flex gap={16} direction={{base: "column", sm: "row"}}>
        <NextLink href="/">
          <Button color="orange" miw={160} onClick={reset}>
            Refresh
          </Button>
        </NextLink>
        <NextLink href="/dashboard/rooms">
          <Button color="yellow" variant="outline" miw={160}>
            Back to Dashboard
          </Button>
        </NextLink>
      </Flex>
    </ErrorLayout>
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
