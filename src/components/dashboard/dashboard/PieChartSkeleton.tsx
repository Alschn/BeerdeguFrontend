import { Box, Flex, Skeleton, type SkeletonProps } from "@mantine/core";

interface PieChartSkeletonProps extends SkeletonProps {
  withLabels?: boolean;
}

export default function PieChartSkeleton({
  withLabels = true,
  ...rest
}: PieChartSkeletonProps) {
  return (
    <Flex justify="center" align="center" direction="column" gap={8}>
      <Box>
        <Skeleton
          h={{ base: 300, sm: 450 }}
          w={{ base: 300, sm: 450 }}
          radius="50%"
          {...rest}
        />
      </Box>
      {withLabels && (
        <Flex direction="row" align="center" gap={4}>
          <Skeleton w={40} h={14} />
          <Skeleton w={80} h={16} />
          <Skeleton w={40} h={14} />
          <Skeleton w={80} h={16} />
        </Flex>
      )}
    </Flex>
  );
}
