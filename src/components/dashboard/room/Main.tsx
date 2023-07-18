import { Box, Stepper } from "@mantine/core";
import { useRoom } from "~/components/context/room";
import Waiting from "./states/Waiting";
import Starting from "./states/Starting";
import InProgress from "./states/InProgress";
import Finished from "./states/Finished";
import { RoomStates } from "~/api/types";

const STEPS = [
  {
    key: "WAITING",
    label: "Waiting",
    description: "Waiting for users to join",
    component: <Waiting />,
  },
  {
    key: "STARTING",
    label: "Starting",
    description: "Host is choosing list of beers",
    component: <Starting />,
  },
  {
    key: "IN_PROGRESS",
    label: "In progress",
    description: "Tasting session has started",
    component: <InProgress />,
  },
  {
    key: "FINISHED",
    label: "Finished",
    description: "Displaying results",
    component: <Finished />,
  },
];

const RoomMain = () => {
  const { state } = useRoom();

  const active = STEPS.findIndex((step) => step.key === state);
  const currentIndex = active === -1 ? 0 : active;

  return (
    <Box p="lg">
      {state === RoomStates.WAITING && <Waiting />}
      {state === RoomStates.STARTING && <Starting />}
      {state === RoomStates.IN_PROGRESS && <InProgress />}
      {state === RoomStates.FINISHED && <Finished />}
      {/* <Stepper
        active={currentIndex}
        breakpoint="md"
        allowNextStepsSelect={false}
        size="sm"
      >
        {STEPS.map((step) => (
          <Stepper.Step
            key={step.key}
            label={step.label}
            description={step.description}
          >
            {step.component}
          </Stepper.Step>
        ))}
      </Stepper> */}
    </Box>
  );
};

export default RoomMain;
