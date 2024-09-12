import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";

export const useSorting = (initial: SortingState) => {
  const [sorting, setSorting] = useState<SortingState>(initial);

  const orderings = sorting.map((s) => {
    return s.desc ? `-${s.id}` : s.id;
  });
  const ordering = orderings.length ? orderings.join(",") : undefined;

  return {
    sorting,
    onSortingChange: setSorting,
    ordering,
  };
};

interface OrderingParams {
  ordering?: string;
}

export const getInitialSortingFromParams = (params?: OrderingParams) => {
  if (!params || !params.ordering) return [];
  return params.ordering.split(",").map((ordering) => {
    const desc = ordering.startsWith("-");
    const id = desc ? ordering.slice(1) : ordering;
    return { id, desc } as const;
  });
};
