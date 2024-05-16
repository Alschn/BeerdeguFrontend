import {
  ActionIcon,
  Box,
  Card,
  type CardProps,
  Flex,
  Group,
  Image,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconGripVertical, IconTrashX } from "@tabler/icons-react";
import { forwardRef } from "react";
import type { BeerObject } from "~/api/types";

interface BeerCardListItemProps extends Omit<CardProps, "children"> {
  onRemove: (beerId: number) => void;
  beer: BeerObject;
  isRemoving: boolean;
  isDragging?: boolean;
  withHandle?: boolean;
}

/**
 * Beer Card item rendered in "beers in room" section in host's view.
 * Supports drag and drop ordering and remove action.
 */
const BeerCardListItem = forwardRef<HTMLDivElement, BeerCardListItemProps>(
  (
    { beer, onRemove, isRemoving, isDragging, withHandle = false, ...props },
    ref
  ) => {
    return (
      <Card
        withBorder
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        shadow={isDragging ? "sm" : "none"}
        mb="sm"
        ref={ref}
        {...props}
      >
        <Group spacing={16} align="center">
          {withHandle && (
            <IconGripVertical style={{ width: 18, height: 18 }} stroke={1.5} />
          )}
          <Image
            height={64}
            width={64}
            fit="contain"
            src={beer.image}
            alt={beer.name}
            withPlaceholder
          />
          <Box>
            <Text size="lg" weight={600}>
              {beer.name}
            </Text>
            <Text size="md">{beer.brewery}</Text>
          </Box>
        </Group>
        <Flex align="center">
          <Tooltip label="Remove beer" position="bottom">
            <ActionIcon
              onClick={() => onRemove(beer.id)}
              color="red"
              loading={isRemoving}
            >
              <IconTrashX />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Card>
    );
  }
);
BeerCardListItem.displayName = "BeerCardListItem";

export default BeerCardListItem;
