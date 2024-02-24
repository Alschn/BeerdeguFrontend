"use client";

import { Grid } from "@mantine/core";
import {
  IconBeer,
  IconCalculator,
  IconHomeMove,
  IconHomePlus,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useState } from "react";
import { getDashboardStatistics } from "~/api/statistics";
import CurrentRoomsAlert from "./CurrentRoomsAlert";
import StatisticsCard from "./StatisticsCard";
import StatisticsHeader from "./StatisticsHeader";
import BeerStylesChartCard from "./dashboard/BeerStylesChartCard";
import BreweriesStylesChartCard from "./dashboard/BreweriesChartCard";
import RecentlyConsumedBeersCard from "./dashboard/RecentlyConsumedBeersCard";
import { formatDateParam, getFirstAndLastDayOfMonth } from "~/utils/dates";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardPage() {
  // todo: initial data from server side fetch (?)
  
  const [datesRange, setDatesRange] = useState<[Date, Date]>(() => {
    return [...getFirstAndLastDayOfMonth()];
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
      <Grid.Col span={12} xs={6} md={12} lg={4}>
        <RecentlyConsumedBeersCard
          beers={stats?.recently_consumed_beers}
          isLoading={isLoadingStats}
        />
      </Grid.Col>
      <Grid.Col span={12} xs={6} md={12} lg={4}>
        <BeerStylesChartCard
          chartData={stats?.beer_styles_distribution_chart}
          isLoading={isLoadingStats}
        />
      </Grid.Col>
      <Grid.Col span={12} xs={6} md={12} lg={4}>
        <BreweriesStylesChartCard
          chartData={stats?.breweries_distribution_chart}
          isLoading={isLoadingStats}
        />
      </Grid.Col>
    </Grid>
  );
}
