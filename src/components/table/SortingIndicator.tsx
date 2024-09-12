import { Tooltip } from "@mantine/core";
import {
  IconArrowNarrowUp,
  IconArrowNarrowDown,
  IconArrowsSort,
} from "@tabler/icons-react";
import type { SortDirection } from "@tanstack/react-table";

interface SortingIndicatorProps {
  column?: string;
  canSort: boolean;
  direction: SortDirection | false;
}

function formatLabel(
  direction: SortingIndicatorProps["direction"],
  column?: string
) {
  const separator = column ? ` by ${column} ` : " ";
  if (direction === "asc") return `Sorted${separator}ascending`;
  if (direction === "desc") return `Sorted${separator}descending`;
  return `Sort${separator}ascending`;
}

export default function SortingIndicator({
  canSort,
  direction,
  column,
}: SortingIndicatorProps) {
  if (!canSort) return false;

  const tooltipProps = {
    label: formatLabel(direction, column),
    position: "bottom",
    withinPortal: true,
  } as const;

  const iconSize = 18;

  if (direction === "asc") {
    return (
      <Tooltip {...tooltipProps}>
        <IconArrowNarrowUp size={iconSize} color="green" />
      </Tooltip>
    );
  }

  if (direction === "desc") {
    return (
      <Tooltip {...tooltipProps}>
        <IconArrowNarrowDown size={iconSize} color="red" />
      </Tooltip>
    );
  }

  return (
    <Tooltip {...tooltipProps}>
      <IconArrowsSort size={iconSize} color="gray" />
    </Tooltip>
  );
}
