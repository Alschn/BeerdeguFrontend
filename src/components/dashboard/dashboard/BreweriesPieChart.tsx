import type { EntityDistributionStat } from "~/api/statistics";
import { usePieChartData } from "~/hooks/usePieChartData";
import PieChart from "../../charts/PieChart";
import PieChartSkeleton from "./PieChartSkeleton";

interface BeerStylesPieChartProps {
  items: EntityDistributionStat[];
  isLoading: boolean;
}

const backgroundColors = [
  "rgba(54, 162, 235, 0.95)",
  "rgba(132, 135, 225, 0.95)",
  "rgba(216, 118, 208, 0.95)",
  "rgba(255, 105, 158, 0.95)",
  "rgba(255, 124, 92, 0.95)",
  "rgba(255, 166, 0, 0.95)",
];

const borderColors = [
  "rgba(54, 162, 235, 1)",
  "rgba(132, 135, 225, 1)",
  "rgba(216, 118, 208, 1)",
  "rgba(255, 105, 158, 1)",
  "rgba(255, 124, 92, 1)",
  "rgba(255, 166, 0, 1)",
];

const showUpToItems = 5;

function BreweriesPieChart({ items, isLoading }: BeerStylesPieChartProps) {
  const [labels, data] = usePieChartData(items, showUpToItems);

  if (isLoading) return <PieChartSkeleton withLabels />;

  return (
    <PieChart
      data={{
        labels: labels,
        datasets: [
          {
            label: "",
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      }}
    />
  );
}

export default BreweriesPieChart;
