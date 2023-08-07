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
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.display({
    header: "Actions",
    // todo: actions
  })
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
