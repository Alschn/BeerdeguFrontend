"use client";

import { Alert, Button, Flex, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { type DashboardStatistics } from "~/api/statistics";

interface CurrentRoomsAlertProps {
  rooms: DashboardStatistics["current_rooms"];
}

function CurrentRoomsAlert({ rooms }: CurrentRoomsAlertProps) {
  return (
    <Flex gap={8}>
      <Alert
        icon={<IconAlertCircle />}
        title={
          <Text size="lg" fw={600}>
            You are currently in {rooms.length}{" "}
            {rooms.length === 1 ? "room" : "rooms"}
          </Text>
        }
      >
        <Flex direction="column" justify="space-between" gap={4} mb={8}>
          <Text fw={600}>
            Being inactive for more than a minute will result in you being
            kicked out of the room.
          </Text>
          <Text fw={600}>
            Enter the room to continue your tasting session or to leave it.
          </Text>
        </Flex>
        <Flex direction="column" gap={12}>
          {rooms.map((room) => (
            <Flex
              key={`alert-room-${room.id}`}
              align="center"
              w="100%"
              gap={16}
            >
              <Text size="lg" fw={600}>
                {room.name}
              </Text>
              <a href={`/dashboard/rooms/${room.name}`}>
                <Button color="blue" size="xs" radius="xl">
                  Join
                </Button>
              </a>
            </Flex>
          ))}
        </Flex>
      </Alert>
    </Flex>
  );
}

export default CurrentRoomsAlert;
