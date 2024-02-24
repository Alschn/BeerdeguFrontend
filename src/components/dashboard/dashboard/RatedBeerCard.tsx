import { Card, Image, Title } from "@mantine/core";
import { type DashboardStatistics } from "~/api/statistics";

interface RatedBeerCardProps {
  rating: DashboardStatistics["highest_rating"];
}

export default function RatedBeerCard({ rating }: RatedBeerCardProps) {
  return (
    <Card radius="lg">
      <Title order={4} fw={500} mb={4}>
        Highest rated beer
      </Title>
      {!!rating && (
        <>
          <Image src={rating.beer?.image} width={150} height={150} alt="" />
          <Title order={5} fw={400}>
            {rating.beer.name}
          </Title>
          <Title order={6} fw={400}>
            {rating.beer.style}
          </Title>
          <Title order={6} fw={400}>
            {rating.beer.brewery}
          </Title>
        </>
      )}
    </Card>
  );
}
