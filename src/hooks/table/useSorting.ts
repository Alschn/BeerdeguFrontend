import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";

interface InitialSorting {
  columnId: string;
  order: "asc" | "desc";
  fieldName?: string;
}

export const useSorting = ({ columnId, order, fieldName }: InitialSorting) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: columnId,
      desc: order === "desc",
    },
  ]);

  let ordering: string | undefined;
  if (sorting.length) {
    const prefix = sorting[0]!.desc ? "-" : "";
    ordering = `${prefix}${fieldName ?? columnId}`;
  } else {
    ordering = undefined;
  }

  return {
    sorting,
    onSortingChange: setSorting,
    ordering,
  };
};

// todo: implement multi-column sorting if needed
export const useMultiSorting = () => null;
