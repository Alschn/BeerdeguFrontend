import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Brewery } from "~/api/types";
import GenericTable from "~/components/GenericTable";

const columnHelper = createColumnHelper<Brewery>();

const columns = [
  columnHelper.accessor("id", {
    header: "#",
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: false,
  }),
  columnHelper.accessor("city", {
    header: "City",
    cell: (info) => info.getValue() || "-",
    enableSorting: false,
  }),
  columnHelper.accessor("country", {
    header: "Country",
    cell: (info) => info.getValue() || "-",
    enableSorting: false,
  }),
  columnHelper.display({
    header: "Actions",
    enableSorting: false,
    // todo: action buttons
  }),
];

interface BreweriesTableProps {
  data: Brewery[];
  isLoading: boolean;
}

const BreweriesTable = ({ data, isLoading }: BreweriesTableProps) => {
  // todo: loading state, sorting, etc.
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

export default BreweriesTable;
