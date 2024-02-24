import { Card, Flex, Skeleton, Title, type CardProps } from "@mantine/core";
import { type DashboardStatistics } from "~/api/statistics";
import BreweriesPieChart from "./BreweriesPieChart";

interface BreweriesStylesChartCardProps extends Omit<CardProps, "children"> {
  chartData?: DashboardStatistics["breweries_distribution_chart"];
  isLoading: boolean;
}

export default function BreweriesStylesChartCard({
  chartData,
  isLoading,
  ...rest
}: BreweriesStylesChartCardProps) {
  return (
    <Card radius="lg" {...rest}>
      {isLoading ? (
        <Flex mb={20} justify="center">
          <Skeleton h={26} w={140} />
        </Flex>
      ) : (
        <Title order={3} mb={12} fw={500} align="center">
          Recent Breweries
        </Title>
      )}
      <Flex direction="column" gap={16} h={{ base: 300, sm: 500 }}>
        {chartData?.length === 0 && (
          <Title order={6} fw={400} align="center">
            You have not consumed any beers this month...
          </Title>
        )}
        <Flex align="center" justify="center" h="100%">
          <BreweriesPieChart items={chartData ?? []} isLoading={isLoading} />
        </Flex>
      </Flex>
    </Card>
  );
}
