import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type BeerStyle } from "~/api/types";
import GenericTable from "~/components/table/GenericTable";

interface BeerStylesTableProps {
  data: BeerStyle[];
  isLoading: boolean;
}

const columnHelper = createColumnHelper<BeerStyle>();

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

const BeerStylesTable = ({ data, isLoading }: BeerStylesTableProps) => {
  // todo: loading state, filtering, etc.
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

export default BeerStylesTable;
