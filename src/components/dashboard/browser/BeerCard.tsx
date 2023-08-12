import {
  createStyles,
  Card,
  CardSection,
  Box,
  Group,
  Divider,
  Image,
  Text,
} from "@mantine/core";
import type { Beer } from "~/api/types";

const useStyles = createStyles((theme) => ({
  card: {
    height: "100%",
    cursor: "pointer",
    transition: "box-shadow 50ms ease",

    "&:hover": {
      boxShadow: theme.shadows.sm,
    },
  },
}));

export default function BeerCard({ beer }: { beer: Beer }) {
  const { classes } = useStyles();

  return (
    <Card
      className={classes.card}
      component="article"
      id={`beer-${beer.id}-card`}
    >
      <CardSection p="lg" component="header">
        <Image
          src={beer.image}
          alt={beer.name}
          height={200}
          fit="contain"
          withPlaceholder
        />
      </CardSection>
      <Box component="section">
        <Text size="lg" fw={600} align="center">
          {beer.name}
        </Text>
        <Text size="md" align="center">
          {beer.style?.name}
        </Text>
        <Text align="center">{beer.brewery.name}</Text>
        <Group position="center">
          <Text size="sm">{beer.percentage}%</Text>
          <Divider orientation="vertical" />
          <Text size="sm">{beer.volume_ml}ml</Text>
        </Group>
      </Box>
    </Card>
  );
}
