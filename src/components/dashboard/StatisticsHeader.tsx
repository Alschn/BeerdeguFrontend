import { Box, Button, Card, Flex, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const intl = new Intl.DateTimeFormat("en", { month: "long" });

interface StatisticsHeaderProps {
  datesRange: [Date, Date];
  onDatesRangeChange?: (datesRange: [Date, Date]) => void;
}

function StatisticsHeader({ datesRange }: StatisticsHeaderProps) {
  const [lowerDate, upperDate] = datesRange;

  // todo: implement date filter modal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDateFilterModalOpen, dateFilterModalHandlers] = useDisclosure(false);

  const handleOpenDateFilterModal = () => {
    // todo: implement
  };

  return (
    <Card radius="lg">
      <Title order={1} mb={4}>
        Your statistics
      </Title>
      <Flex
        direction={{ base: "column", xs: "row" }}
        align={{ base: "unset", xs: "center" }}
        gap={{ base: 8, xs: 16 }}
      >
        <Box>
          <Text display="inline-block" size="lg" color="dimmed" fw={600}>
            {intl.format(lowerDate)}
          </Text>{" "}
          <Text display="inline-block" size="lg" fw={700}>
            {lowerDate.getFullYear()}
          </Text>
          {" - "}
          <Text display="inline-block" size="lg" color="dimmed" fw={600}>
            {intl.format(upperDate)}
          </Text>{" "}
          <Text display="inline-block" size="lg" fw={700}>
            {upperDate.getFullYear()}
          </Text>
        </Box>
        <Button
          radius="xl"
          variant="outline"
          size="xs"
          // todo: remove when modal is implemented
          disabled
          onClick={handleOpenDateFilterModal}
        >
          Change date filter
        </Button>
      </Flex>
    </Card>
  );
}

export default StatisticsHeader;
