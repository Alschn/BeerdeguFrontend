import {
  Button,
  Card,
  Container,
  Flex,
  Text,
  Divider,
  rem,
} from "@mantine/core";
import { useState } from "react";
import { useRoom } from "~/components/context/room";
import BeerForm from "../BeerForm";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { BeerObject } from "~/api/types";
import BeerDisplay from "../BeerDisplay";

const InProgress = () => {
  const { beers } = useRoom();
  const [activeStep, setActiveStep] = useState(0);

  const totalBeers = beers.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const currentBeer = beers[activeStep] as BeerObject;

  if (totalBeers === 0) return null;

  return (
    <Container id="inprogress-container">
      <Flex
        align="center"
        justify="space-between"
        mb={16}
        id="inprogress-stepper"
      >
        <Button
          leftIcon={<IconArrowLeft size={rem(16)} />}
          disabled={activeStep === 0}
          onClick={handlePrevious}
          id="inprogress-stepper-previous"
        >
          Previous
        </Button>
        <Text size="xl" weight={700} id="inprogress-stepper-label">
          {activeStep + 1} / {totalBeers}
        </Text>
        <Button
          rightIcon={<IconArrowRight size={rem(16)} />}
          disabled={activeStep === totalBeers - 1}
          onClick={handleNext}
          id="inprogress-stepper-next"
        >
          Next
        </Button>
      </Flex>

      <Card withBorder id="inprogress-main">
        <BeerDisplay beer={currentBeer} />
        <Divider my={16} />
        <BeerForm id={currentBeer.id} />
      </Card>
    </Container>
  );
};

export default InProgress;
