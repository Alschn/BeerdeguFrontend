import { Center, Grid, Image, Box, Text, Spoiler } from "@mantine/core";
import type { BeerObject } from "~/api/types";

const BeerDisplay = ({ beer }: { beer: BeerObject }) => {
  return (
    <Grid>
      <Grid.Col xl={3}>
        <Center>
          <Image
            src={beer?.image}
            width={200}
            height={200}
            fit="contain"
            alt={beer.name}
            withPlaceholder
          />
        </Center>
      </Grid.Col>
      <Grid.Col span="auto">
        <Box>
          <Text display="inline-block" weight={600}>
            Name:
          </Text>{" "}
          <Text display="inline-block">{beer.name || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Brewery:
          </Text>{" "}
          <Text display="inline-block">{beer.brewery || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Style:
          </Text>{" "}
          <Text display="inline-block">{beer.style || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            ABV [%]:
          </Text>{" "}
          <Text display="inline-block">{beer.percentage || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Extract [°BLG]:
          </Text>{" "}
          <Text display="inline-block">{beer.extract || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Bitterness [IBU]:
          </Text>{" "}
          <Text display="inline-block">{beer.IBU || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Hoprate [g/L]:
          </Text>{" "}
          <Text display="inline-block">{beer.hop_rate || "?"}</Text>
        </Box>
      </Grid.Col>
      <Spoiler
        ml={12}
        maxHeight={0}
        showLabel="Show description"
        hideLabel="Hide description"
      >
        {beer.description}
      </Spoiler>
    </Grid>
  );
};

export default BeerDisplay;
