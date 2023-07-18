import {
  Button,
  Container,
  Flex,
  Title,
  Text,
  Paper,
  rem,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconDownload,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import type {
  AxiosResponseHeaders,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useState } from "react";
import { useRoom } from "~/components/context/room";
import UserRatingTable from "../UserRatingsTable";
import BeerRatingsTable from "../BeerRatingsTable";
import { notifications } from "@mantine/notifications";
import { axiosGatewayClient } from "~/api/AxiosClient";

const generateReport = (
  roomName: string,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<Blob>> => {
  return axiosGatewayClient.get(`/api/rooms/${roomName}/report/`, {
    responseType: "blob",
    ...options,
  });
};

const useGenerateReportMutation = (roomName: string) =>
  useMutation(() => generateReport(roomName), {
    onSuccess: (response) => {
      const contentDisposition = (response.headers as AxiosResponseHeaders).get(
        "content-disposition"
      ) as string;
      const fragments = contentDisposition.split(";");
      const filename = fragments[1]?.split("=")[1];
      const cleanedFilename = filename?.replace(/"/g, "") as string;

      // create file link in browser's memory
      const href = URL.createObjectURL(response.data);

      // create "a" HTLM element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", cleanedFilename);
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    },
    onError: () => {
      notifications.show({
        title: "Failed to download report",
        message: "Try again later...",
        color: "red",
      });
    },
  });

const Finished = () => {
  const { roomName, userResults, results } = useRoom();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const mutation = useGenerateReportMutation(roomName);

  return (
    <Container>
      <Title order={1} mb={rem(32)} align="center">
        Beer tasting session has ended!
      </Title>
      <Flex align="center" justify="space-between" mb={rem(16)}>
        <Button
          leftIcon={<IconArrowLeft size={rem(16)} />}
          disabled={activeStep === 0}
          onClick={handlePrevious}
        >
          Your notes
        </Button>
        <Text size="xl" weight={700}>
          {activeStep + 1} / 2
        </Text>
        <Button
          rightIcon={<IconArrowRight size={rem(16)} />}
          disabled={activeStep === 1}
          onClick={handleNext}
        >
          Results
        </Button>
      </Flex>
      <Paper withBorder mb={rem(16)}>
        {activeStep === 0 ? (
          <UserRatingTable data={userResults} />
        ) : (
          <BeerRatingsTable data={results} />
        )}
      </Paper>
      <Flex justify="end">
        <Button
          leftIcon={<IconDownload size={rem(20)} />}
          onClick={() => mutation.mutate()}
          loading={mutation.isLoading}
        >
          {"Download report"}
        </Button>
      </Flex>
    </Container>
  );
};

export default Finished;
