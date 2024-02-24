import {
  Box,
  Card,
  Flex,
  Image,
  Skeleton,
  Title,
  type CardProps,
} from "@mantine/core";
import { type DashboardStatistics } from "~/api/statistics";

interface RecentlyConsumedBeersCardProps extends Omit<CardProps, "children"> {
  beers?: DashboardStatistics["recently_consumed_beers"];
  isLoading: boolean;
}

export default function RecentlyConsumedBeersCard({
  beers,
  isLoading,
  ...rest
}: RecentlyConsumedBeersCardProps) {
  return (
    <Card radius="lg" {...rest}>
      {isLoading ? (
        <Flex mb={20} justify="center">
          <Skeleton h={26} w={140} />
        </Flex>
      ) : (
        <Title order={3} mb={12} fw={500} align="center">
          Recent Beers
        </Title>
      )}
      <Flex
        direction="column"
        gap={16}
        h={{ base: 300, sm: 500 }}
        sx={{ overflow: "auto" }}
      >
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <BeerRowSkeleton key={`beer-skeleton-${index}`} />
          ))}
        {beers?.length === 0 && (
          <Title order={6} fw={400} align="center">
            You have not consumed any beers this month...
          </Title>
        )}
        {beers?.map((beer) => (
          <BeerRowItem key={`beer-${beer.id}`} beer={beer} />
        ))}
      </Flex>
    </Card>
  );
}

function BeerRowSkeleton() {
  return (
    <Flex direction="row" align="center" gap={8}>
      <Skeleton h={64} w={64} />
      <Flex direction="column" gap={4}>
        <Skeleton w={160} h={20} />
        <Skeleton w={120} h={18} />
        <Skeleton w={140} h={18} />
      </Flex>
    </Flex>
  );
}

interface BeerRowItemProps {
  beer: DashboardStatistics["recently_consumed_beers"][number];
}

function BeerRowItem({ beer }: BeerRowItemProps) {
  return (
    <Flex key={`beer-${beer.id}`} direction="row" align="center" gap={8}>
      <Box>
        <Image
          src={beer?.image}
          width={64}
          height={64}
          alt=""
          withPlaceholder
        />
      </Box>
      <Box>
        <Title order={4} fw={500}>
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
  );
}
