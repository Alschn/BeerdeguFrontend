import type { EntityDistributionStat } from "~/api/statistics";
import PieChart from "../charts/PieChart";
import { usePieChartData } from "~/hooks/usePieChartData";

interface BeerStylesPieChartProps {
  items: EntityDistributionStat[];
  isLoading: boolean;
}

const backgroundColors = [
  "rgba(255, 99, 132, 0.95)",
  "rgba(54, 162, 235, 0.95)",
  "rgba(255, 206, 86, 0.95)",
  "rgba(75, 192, 192, 0.95)",
  "rgba(153, 102, 255, 0.95)",
  "rgba(255, 159, 64, 0.95)",
];

const borderColors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

const showUpToItems = 5;

function BreweriesPieChart({ items, isLoading }: BeerStylesPieChartProps) {
  const [labels, data] = usePieChartData(items, showUpToItems);

  // todo: skeleton
  if (isLoading) return null;

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
            borderWidth: 0,
          },
        ],
      }}
    />
  );
}

export default BreweriesPieChart;
