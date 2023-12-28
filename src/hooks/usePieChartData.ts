import { useMemo } from "react";
import { type EntityDistributionStat } from "~/api/statistics";

export const usePieChartData = (
  items: EntityDistributionStat[],
  limit: number = 5
) => {
  return useMemo(() => {
    if (items.length <= limit) {
      return [
        items.map((item) => item.name),
        items.map((item) => item.count),
      ] as const;
    }

    const mainItems = items.slice(0, limit);
    const otherItems = items.slice(limit);
    const mergedOther = otherItems.reduce<EntityDistributionStat>(
      (acc, curr) => {
        acc.count += curr.count;
        return acc;
      },
      { name: "Other", count: 0 }
    );
    const mergedData = [...mainItems, mergedOther];
    const names = mergedData.map((item) => item.name);
    const values = mergedData.map((item) => item.count);
    return [names, values] as const;
  }, [items, limit]);
};
