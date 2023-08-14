import { Group, Avatar, Badge, Text } from "@mantine/core";
import { IconBottle } from "@tabler/icons-react";

interface BeerRowItemProps {
  image: string | null;
  label: string;
  description: string;
  badge: string;
}

export default function BeerRowItem({
  image,
  label,
  description,
  badge,
}: BeerRowItemProps) {
  return (
    <Group noWrap>
      <Avatar
        src={image}
        alt={label}
        size={64}
        imageProps={{
          style: {
            objectFit: "contain",
          },
        }}
      >
        <IconBottle size="1.5rem" />
      </Avatar>
      <div>
        <Text size="sm">{label}</Text>
        <Text size="xs" opacity={0.65}>
          {description}
        </Text>
        <Badge size="xs">{badge}</Badge>
      </div>
    </Group>
  );
}
