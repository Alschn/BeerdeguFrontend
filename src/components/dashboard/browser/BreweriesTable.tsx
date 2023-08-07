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
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("city", {
    header: "City",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("country", {
    header: "Country",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.display({
    header: "Actions",
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
