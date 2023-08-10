import {
  Card,
  Image,
  Grid,
  Flex,
  Stack,
  Rating,
  Textarea,
  Box,
  Text,
  Avatar,
  Title,
  Divider,
  Badge,
  Group,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { RoomStates, type Rating as RatingType } from "~/api/types";
import NextLink from "next/link";

const intl = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const MAX_INPUT_LENGTH = 300;

interface RatingCardProps {
  rating: RatingType;
  onEdit: (rating: RatingType) => void;
  onDelete: (rating: RatingType) => void;
}

export default function RatingCard({
  rating,
  onEdit,
  onDelete,
}: RatingCardProps) {
  const isInRoom = !!rating.room;
  const isInRoomInProgress =
    isInRoom && rating.room.state === RoomStates.IN_PROGRESS;

  const canEdit = !isInRoom || isInRoomInProgress;
  const canDelete = !isInRoom;

  const handleOpenEdit = () => onEdit(rating);
  const handleOpenDelete = () => onDelete(rating);

  return (
    <Card key={`rating-${rating.id}`} shadow="sm">
      <Flex justify="space-between" align="center">
        <Box>
          <Title>Rating #{rating.id}</Title>
          {isInRoom && (
            <Title order={2} opacity={0.65} fw={500}>
              Room: {rating.room.name}
            </Title>
          )}
        </Box>
        <Group align="center">
          {canEdit && (
            <Tooltip label="Edit">
              <ActionIcon
                variant="light"
                color="yellow.6"
                onClick={handleOpenEdit}
              >
                <IconEdit />
              </ActionIcon>
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip label="Delete">
              <ActionIcon
                variant="light"
                color="red"
                onClick={handleOpenDelete}
              >
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Flex>
      <Divider my={8} />
      <Flex mb={16} gap={16} align="center">
        <Box>
          <Avatar radius="xl" size={48}>
            {rating.added_by.username.substring(0, 2)}
          </Avatar>
        </Box>
        <Flex direction="column">
          <Text size="lg" fw={700}>
            {rating.added_by.username}
          </Text>
          <Text size="sm">{intl.format(new Date(rating.created_at))}</Text>
        </Flex>
      </Flex>
      <Grid>
        <Grid.Col span={12} sm={4}>
          <Flex align="center" justify="center" w="100%" mb={16} pt={16}>
            <Image
              src={rating.beer.image}
              alt={rating.beer.name}
              height={200}
              withPlaceholder
              fit="contain"
            />
          </Flex>
          <Flex direction="column">
            <NextLink href={`/dashboard/browser/beers/${rating.beer.id}`}>
              <Title order={2}>{rating.beer.name}</Title>
            </NextLink>
            <Text size="lg">{rating.beer.brewery}</Text>
            {!!rating.beer.style && (
              <Box>
                <Badge size="sm">{rating.beer.style}</Badge>
              </Box>
            )}
          </Flex>
        </Grid.Col>
        <Grid.Col span={12} sm={8}>
          <Stack spacing={16}>
            <Textarea
              id={`rating-${rating.id}-color`}
              name={`rating-${rating.id}-color`}
              value={rating.color || ""}
              label="Color"
              placeholder="Color"
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Textarea
              id={`rating-${rating.id}-foam`}
              name={`rating-${rating.id}-foam`}
              value={rating.foam || ""}
              label="Foam"
              placeholder="Foam"
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Textarea
              id={`rating-${rating.id}-smell`}
              name={`rating-${rating.id}-smell`}
              value={rating.smell || ""}
              label="Smell"
              placeholder="Smell"
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Textarea
              id={`rating-${rating.id}-taste`}
              name={`rating-${rating.id}-taste`}
              value={rating.taste || ""}
              label="Taste"
              placeholder="Taste"
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Textarea
              id={`rating-${rating.id}-opinion`}
              name={`rating-${rating.id}-opinion`}
              value={rating.opinion || ""}
              label="Opinion"
              placeholder="Opinion"
              minRows={3}
              maxLength={MAX_INPUT_LENGTH}
              readOnly
            />
            <Flex align="center" gap={16}>
              <Rating value={rating.note || 0} count={10} readOnly />
              <Text size="sm" fw={600}>
                ({rating.note || "?"}/{10})
              </Text>
            </Flex>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
