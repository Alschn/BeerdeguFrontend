import { useMantineColorScheme } from "@mantine/core";
import { Pie, type ChartProps } from "react-chartjs-2";

interface PieChartProps extends Omit<ChartProps<"pie">, "type"> {}

function PieChart({ options, data, ...props }: PieChartProps) {
  const { colorScheme } = useMantineColorScheme();

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
              },
              color: colorScheme === "dark" ? "#fff" : "#000",
            },
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
