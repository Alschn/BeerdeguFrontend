import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Hop } from "~/api/types";
import GenericTable from "~/components/GenericTable";

interface HopsTableProps {
  data: Hop[];
  isLoading: boolean;
}

const columnHelper = createColumnHelper<Hop>();

const columns = [
  columnHelper.accessor("id", {
    header: "#",
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: false,
  }),
  columnHelper.accessor("country", {
    header: "Country",
    cell: (info) => info.getValue() || "-",
    enableSorting: false,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue() || "-",
    enableSorting: false,
  }),
  columnHelper.display({
    header: "Actions",
    enableSorting: false,
    // todo: actions
  }),
];

const HopsTable = ({ data, isLoading }: HopsTableProps) => {
  // todo: loading state, filtering
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <GenericTable
      table={table}
      isLoading={isLoading}
      verticalSpacing="md"
      fontSize="sm"
      highlightOnHover
    />
  );
};

export default HopsTable;
