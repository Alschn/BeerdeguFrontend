"use client";
import { Container, Loader } from "@mantine/core";

export default function RoomPageLoading() {
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Loader color="orange" size="xl" />
    </Container>
  );
}
