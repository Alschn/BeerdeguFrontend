import { Badge, Box, Center, Image, Stack, Text } from "@mantine/core";
import type { Beer } from "~/api/types";

const BeerDetailsModalBody = ({ beer }: { beer: Beer }) => {
  return (
    <Stack spacing={8}>
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
      <Stack spacing={4}>
        <Box>
          <Text display="inline-block" weight={600}>
            Name:
          </Text>{" "}
          <Text display="inline-block">{beer.name}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Brewery:
          </Text>{" "}
          <Text display="inline-block">{beer.brewery?.name || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Style:
          </Text>{" "}
          <Text display="inline-block">{beer.style?.name || "?"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            ABV [%]:
          </Text>{" "}
          <Text display="inline-block">{beer.percentage}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Extract [°BLG]:
          </Text>{" "}
          <Text display="inline-block">{beer.extract || "-"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Bitterness [IBU]:
          </Text>{" "}
          <Text display="inline-block">{beer.IBU || "-"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Hoprate [g/L]:
          </Text>{" "}
          <Text display="inline-block">{beer.hop_rate || "-"}</Text>
        </Box>
        <Box>
          <Text display="inline-block" weight={600}>
            Hops:
          </Text>{" "}
          <Box display="inline">
            {beer.hops.map((hop) => (
              <Badge key={`badge-hop-${hop.id}1`} mr={4}>
                {hop.name}
              </Badge>
            ))}
          </Box>
        </Box>
      </Stack>
      <Text>{beer.description}</Text>
    </Stack>
  );
};

export default BeerDetailsModalBody;
