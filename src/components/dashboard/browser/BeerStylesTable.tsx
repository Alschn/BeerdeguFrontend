import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type BeerStyle } from "~/api/types";
import GenericTable from "~/components/GenericTable";

interface BeerStylesTableProps {
  data: BeerStyle[];
  isLoading: boolean;
}

const columnHelper = createColumnHelper<BeerStyle>();

const columns = [
  columnHelper.accessor("id", {
    header: "#",
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("country", {
    header: "Country",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.display({
    header: "Actions",
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
