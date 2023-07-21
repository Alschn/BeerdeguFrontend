import {
  Button,
  Card,
  Container,
  Flex,
  Text,
  Divider,
  rem,
  LoadingOverlay,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { useRoom } from "~/components/context/room";
import BeerForm from "../BeerForm";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { BeerObject } from "~/api/types";
import BeerDisplay from "../BeerDisplay";

const SAVING_TIMEOUT = 500;

const InProgress = () => {
  const { beers } = useRoom();
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const handleNext = () => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setIsAutoSaving(false);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, SAVING_TIMEOUT);
  };

  const handlePrevious = () => {
    setIsAutoSaving(true);
    setTimeout(() => {
      setIsAutoSaving(false);
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }, SAVING_TIMEOUT);
  };

  const currentBeer = useMemo(() => {
    return beers[activeStep] as BeerObject;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beers, activeStep, isAutoSaving]);

  const totalBeers = beers.length;

  if (totalBeers === 0) return null;

  return (
    <Container id="inprogress-container">
      <LoadingOverlay id="inprogress-overlay" visible={isAutoSaving} />
      <StepperHeader
        activeStep={activeStep}
        totalSteps={totalBeers}
        onPrevious={handlePrevious}
        onNext={handleNext}
        id="inprogress-stepper"
      />
      <Card withBorder id="inprogress-main">
        <BeerDisplay beer={currentBeer} />
        <Divider my={16} />
        <BeerForm id={currentBeer.id} />
      </Card>
    </Container>
  );
};

interface StepperHeaderProps {
  id?: string;
  activeStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  showTopLabel?: boolean;
}

function StepperHeader({
  activeStep,
  totalSteps,
  onNext,
  onPrevious,
  id,
  previousLabel = "Previous",
  nextLabel = "Next",
  showTopLabel = true,
}: StepperHeaderProps) {
  return (
    <Flex align="center" justify="space-between" mb={16} id={id}>
      <Button
        leftIcon={<IconArrowLeft size={rem(16)} />}
        disabled={activeStep === 0}
        onClick={onPrevious}
        id="inprogress-stepper-previous"
      >
        {previousLabel}
      </Button>
      {showTopLabel && (
        <Text size="xl" weight={700} id="inprogress-stepper-label">
          {activeStep + 1} / {totalSteps}
        </Text>
      )}
      <Button
        rightIcon={<IconArrowRight size={rem(16)} />}
        disabled={activeStep === totalSteps - 1}
        onClick={onNext}
        id="inprogress-stepper-next"
      >
        {nextLabel}
      </Button>
    </Flex>
  );
}

export default InProgress;
