"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBeer,
  IconCalculator,
  IconHomeMove,
  IconHomePlus,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getDashboardStatistics } from "~/api/statistics";
import StatisticsCard from "./StatisticsCard";
import { IconAlertCircle } from "@tabler/icons-react";

const intl = new Intl.DateTimeFormat("en", { month: "long" });

function formatDateParam(date: Date) {
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;
  const year = date.getFullYear();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  return [year, month, day].join("-");
}

export default function DashboardPage() {
  // todo: initial data from server side fetch (?)

  const [datesRange] = useState<[Date, Date]>(() => {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    const lastDayOfMonth = new Date(firstDayOfMonth);
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
    return [firstDayOfMonth, lastDayOfMonth];
  });
  const [lowerDate, upperDate] = datesRange;

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["statistics-dashboard", datesRange] as const,
    queryFn: async ({ queryKey }) => {
      const [lower, upper] = queryKey[1];
      const res = await getDashboardStatistics({
        date_from: formatDateParam(lower),
        date_to: formatDateParam(upper),
      });
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  // todo: implement date filter modal
  const [isDateFilterModalOpen, dateFilterModalHandlers] = useDisclosure(false);

  const handleOpenDateFilterModal = () => {
    // todo: implement
  };

  return (
    <Grid>
      {!!stats && stats.current_rooms.length > 0 && (
        <Flex gap={8}>
          <Alert
            icon={<IconAlertCircle />}
            title={
              <Text size="lg" fw={600}>
                You are currently in {stats.current_rooms.length}{" "}
                {stats.current_rooms.length === 1 ? "room" : "rooms"}
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
              {stats.current_rooms.map((room) => (
                <Flex
                  align="center"
                  gap={16}
                  w="100%"
                  key={`alert-room-${room.id}`}
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
      )}
      <Grid.Col span={12}>
        <Card radius="lg">
          <Title order={1} mb={4}>
            Your statistics
          </Title>
          <Flex align="center" gap={16}>
            <Box>
              <Text display="inline-block" size="lg" color="dimmed" fw={600}>
                {intl.format(lowerDate)}
              </Text>{" "}
              <Text display="inline-block" size="lg" fw={700}>
                {lowerDate.getFullYear()}
              </Text>
              {" - "}
              <Text display="inline-block" size="lg" color="dimmed" fw={600}>
                {intl.format(upperDate)}
              </Text>{" "}
              <Text display="inline-block" size="lg" fw={700}>
                {upperDate.getFullYear()}
              </Text>
            </Box>
            <Button
              radius="xl"
              variant="outline"
              size="xs"
              // todo: remove when modal is implemented
              disabled
              onClick={handleOpenDateFilterModal}
            >
              Change date filter
            </Button>
          </Flex>
        </Card>
      </Grid.Col>
      <Grid.Col span={12}>
        <Grid>
          <Grid.Col span={12} sm={6} lg={3}>
            <StatisticsCard
              title="Beers consumed"
              value={stats?.consumed_beers_count ?? "-"}
              icon={<IconBeer size={40} />}
              isLoading={isLoadingStats}
            />
          </Grid.Col>
          <Grid.Col span={12} sm={6} lg={3}>
            <StatisticsCard
              title="Average rating"
              value={stats?.average_rating ?? "-"}
              icon={<IconCalculator size={40} />}
              isLoading={isLoadingStats}
            />
          </Grid.Col>
          <Grid.Col span={12} sm={6} lg={3}>
            <StatisticsCard
              title="Rooms joined"
              value={stats?.rooms_joined_count ?? "-"}
              icon={<IconHomeMove size={40} />}
              isLoading={isLoadingStats}
            />
          </Grid.Col>
          <Grid.Col span={12} sm={6} lg={3}>
            <StatisticsCard
              title="Rooms created"
              value={stats?.rooms_created_count ?? "-"}
              icon={<IconHomePlus size={40} />}
              isLoading={isLoadingStats}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
}
