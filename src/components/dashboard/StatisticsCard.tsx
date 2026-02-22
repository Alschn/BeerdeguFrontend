import { Card, Flex, Box, Title, Skeleton } from "@mantine/core";
import { type ReactNode } from "react";

export default function StatisticsCard({
  title,
  value,
  icon,
  description,
  isLoading,
}: {
  title: string;
  value: number | string;
  description?: string;
  icon: ReactNode;
  isLoading: boolean;
}) {
  return (
    <Card
      sx={{ display: "flex" }}
      p={{ base: 12, sm: 16 }}
      mih={72}
      radius="lg"
      h="100%"
    >
      <Flex align="center" gap={16}>
        {isLoading ? (
          <StatisticsCardSkeleton />
        ) : (
          <>
            <Flex align="center">{icon}</Flex>
            <Box>
              <Title order={6} color="dimmed" fw={500}>
                {title}
              </Title>
              <Title order={4} fw={600}>
                {value}
              </Title>
              {!!description && (
                <Title order={6} color="dimmed" fw={500}>
                  {description}
                </Title>
              )}
            </Box>
          </>
        )}
      </Flex>
    </Card>
  );
}

function StatisticsCardSkeleton() {
  return (
    <>
      <Flex align="center">
        <Skeleton h={40} w={40} />
      </Flex>
      <Flex gap={4} direction="column">
        <Skeleton h={20} w={100} />
        <Skeleton h={20} w={12} />
      </Flex>
    </>
  );
}
