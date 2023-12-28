"use client";

import { Box, Card, Flex, Grid, Image, Title } from "@mantine/core";
import {
  IconBeer,
  IconCalculator,
  IconHomeMove,
  IconHomePlus,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  type DashboardStatistics,
  getDashboardStatistics,
} from "~/api/statistics";
import CurrentRoomsAlert from "./CurrentRoomsAlert";
import StatisticsCard from "./StatisticsCard";
import StatisticsHeader from "./StatisticsHeader";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import BeerStylesPieChart from "./BeerStylesPieChart";
import BreweriesPieChart from "./BreweriesPieChart";

ChartJS.register(ArcElement, Tooltip, Legend);

function getInitialDatesRange() {
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  const lastDayOfMonth = new Date(firstDayOfMonth);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
  return [firstDayOfMonth, lastDayOfMonth] as const;
}

function formatDateParam(date: Date) {
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;
  const year = date.getFullYear();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  return [year, month, day].join("-");
}

interface RecentlyConsumedBeersCardProps {
  beers: DashboardStatistics["recently_consumed_beers"];
}

function RecentlyConsumedBeersCard({ beers }: RecentlyConsumedBeersCardProps) {
  return (
    <Card radius="lg" mih={420}>
      <Title order={4} fw={500} mb={8}>
        Recently consumed beers
      </Title>
      <Flex direction="column" gap={16}>
        {beers.map((beer) => (
          <Flex key={`beer-${beer.id}`} direction="row" align="center" gap={8}>
            <Box>
              <Image src={beer?.image} width={50} height={50} alt="" />
            </Box>
            <Box>
              <Title order={5} fw={500}>
                {beer.name}
              </Title>
              <Title order={6} fw={400}>
                {beer.style}
              </Title>
              <Title order={6} fw={400}>
                {beer.brewery}
              </Title>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
}

// interface RatedBeerCardProps {
//   rating: DashboardStatistics["highest_rating"];
// }

// function RatedBeerCard({ rating }: RatedBeerCardProps) {
//   if (!rating) return null;

//   return (
//     <Card radius="lg">
//       <Title order={4} fw={500} mb={4}>
//         Highest rated beer
//       </Title>
//       <Image src={rating.beer?.image} width={150} height={150} alt="" />
//       <Title order={5} fw={400}>
//         {rating.beer.name}
//       </Title>
//       <Title order={6} fw={400}>
//         {rating.beer.style}
//       </Title>
//       <Title order={6} fw={400}>
//         {rating.beer.brewery}
//       </Title>
//     </Card>
//   );
// }

export default function DashboardPage() {
  // todo: initial data from server side fetch (?)

  const [datesRange, setDatesRange] = useState<[Date, Date]>(() => {
    return [...getInitialDatesRange()];
  });

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

  return (
    <Grid>
      {!!stats && stats.current_rooms.length > 0 && (
        <CurrentRoomsAlert rooms={stats.current_rooms} />
      )}
      <Grid.Col span={12}>
        <StatisticsHeader
          datesRange={datesRange}
          onDatesRangeChange={setDatesRange}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Grid>
          <Grid.Col span={6} sm={6} lg={3}>
            <StatisticsCard
              title="Beers consumed"
              value={stats?.consumed_beers_count ?? "-"}
              icon={<IconBeer size={40} />}
              isLoading={isLoadingStats}
            />
          </Grid.Col>
          <Grid.Col span={6} sm={6} lg={3}>
            <StatisticsCard
              title="Average rating"
              value={stats?.average_rating ?? "-"}
              icon={<IconCalculator size={40} />}
              isLoading={isLoadingStats}
            />
          </Grid.Col>
          <Grid.Col span={6} sm={6} lg={3}>
            <StatisticsCard
              title="Rooms joined"
              value={stats?.rooms_joined_count ?? "-"}
              icon={<IconHomeMove size={40} />}
              isLoading={isLoadingStats}
            />
          </Grid.Col>
          <Grid.Col span={6} sm={6} lg={3}>
            <StatisticsCard
              title="Rooms created"
              value={stats?.rooms_created_count ?? "-"}
              icon={<IconHomePlus size={40} />}
              isLoading={isLoadingStats}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={12} lg={4}>
        <Grid>
          <Grid.Col span={12}>
            {!!stats && (
              <RecentlyConsumedBeersCard
                beers={stats.recently_consumed_beers}
              />
            )}
          </Grid.Col>
          {/* <Grid.Col span={12} lg={6}>
            {!!stats && <RatedBeerCard rating={stats.highest_rating} />}
          </Grid.Col>
          <Grid.Col span={12} lg={6}>
            {!!stats && <RatedBeerCard rating={stats.lowest_rating} />}
          </Grid.Col> */}
          {/* <Grid.Col span={12} lg={6}>
            <Card radius="lg">
              <Title order={4} fw={500} mb={4}>
                Favourite style
              </Title>
              <Title order={5} fw={400}>
                {stats?.favourite_beer_style?.name}
              </Title>
            </Card>
          </Grid.Col>
          <Grid.Col span={12} lg={6}>
            <Card radius="lg">
              <Title order={4} fw={500} mb={4}>
                Favourite brewery
              </Title>
              <Title order={5} fw={400}>
                {stats?.favourite_brewery?.name}
              </Title>
            </Card>
          </Grid.Col> */}
        </Grid>
      </Grid.Col>
      <Grid.Col span={12} xs={6} md={12} lg={4}>
        <Card radius="lg">
          <Title order={3} mb={12} fw={500} align="center">
            Beer styles
          </Title>
          <Flex align="center" justify="center" h={{ base: 300, sm: 500 }}>
            {!!stats && (
              <BeerStylesPieChart
                items={stats.beer_styles_distribution_chart}
                isLoading={isLoadingStats}
              />
            )}
          </Flex>
        </Card>
      </Grid.Col>
      <Grid.Col span={12} xs={6} md={12} lg={4}>
        <Card radius="lg">
          <Title order={3} mb={12} fw={500} align="center">
            Breweries
          </Title>
          <Flex align="center" justify="center" h={{ base: 300, sm: 500 }}>
            {!!stats && (
              <BreweriesPieChart
                items={stats.breweries_distribution_chart}
                isLoading={isLoadingStats}
              />
            )}
          </Flex>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
