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
    <Card radius="lg" py={20} mih={88}>
      <Flex align="center" gap={12}>
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
                  {title}
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
