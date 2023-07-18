import { Card, Center, Divider, Grid, Title, Text, Image } from "@mantine/core";
import type { BeerObject } from "~/api/types";
import { useRoom } from "~/components/context/room";

export function DetailedBeerCard({ beer }: { beer: BeerObject }) {
  return (
    <Card withBorder h="100%">
      <Card.Section p={16}>
        <Grid>
          <Grid.Col xs={12} sm={4} md={3} xl={1}>
            <Center>
              <Image
                src={beer.image}
                alt={beer.name}
                withPlaceholder
                width={128}
                height={128}
                fit="contain"
              />
            </Center>
          </Grid.Col>
          <Grid.Col span="auto">
            <Text size="lg" weight={600}>
              {beer.name}
            </Text>
            <Text size="md">{beer.brewery}</Text>
            <Divider my={8} />
            <Text>{beer.description}</Text>
          </Grid.Col>
        </Grid>
      </Card.Section>
    </Card>
  );
}

export default function ParticipantView() {
  const { beers } = useRoom();

  return (
    <Grid>
      <Grid.Col xs={12}>
        <Title order={2} align="center" mb={16}>
          Beers in room:
        </Title>
      </Grid.Col>

      {beers.map((beer) => (
        <Grid.Col key={`beer-in-room-${beer.id}`}>
          <DetailedBeerCard beer={beer} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
