import { Table } from "@mantine/core";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { UserRatingsObject } from "~/api/types";

interface UserRatingTableProps {
  data: UserRatingsObject[];
}

const columnHelper = createColumnHelper<UserRatingsObject>();

const columns = [
  columnHelper.accessor("color", {
    header: "Color",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("foam", {
    header: "Foam",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("smell", {
    header: "Smell",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("taste", {
    header: "Taste",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("opinion", {
    header: "Opinion",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("note", {
    header: "Note",
    cell: (info) => info.getValue() || "-",
  }),
];

const UserRatingTable = ({ data }: UserRatingTableProps) => {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table verticalSpacing="lg" fontSize="md">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            <th>#</th>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index) => (
          <tr key={row.id}>
            <td>{index + 1}</td>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserRatingTable;
