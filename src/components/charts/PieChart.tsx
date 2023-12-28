import { Pie } from "react-chartjs-2";
import type { ChartProps } from "react-chartjs-2/dist/types";

interface PieChartProps extends Omit<ChartProps<"pie">, "type"> {}

function PieChart({ options, data, ...props }: PieChartProps) {
  return (
    <Pie
      options={{
        layout: {
          padding: 0,
        },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              font: {
                size: 12,
              }
            }
          },
        },
        ...options,
      }}
      data={data}
      {...props}
    />
  );
}

export default PieChart;
