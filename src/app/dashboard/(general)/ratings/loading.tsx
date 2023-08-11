"use client";

import { Center, Loader } from "@mantine/core";

export default function DashboardRatingsLoading() {
  return (
    <Center
      sx={{
        minHeight: "calc(100vh - 60px)",
      }}
    >
      <Loader />
    </Center>
  );
}
