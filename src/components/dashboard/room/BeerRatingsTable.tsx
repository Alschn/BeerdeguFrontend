import { Table } from "@mantine/core";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { RatingsObject } from "~/api/types";

interface BeerRatingsTableProps {
  data: RatingsObject[];
}

const columnHelper = createColumnHelper<RatingsObject>();

const columns = [
  columnHelper.accessor("beer.name", {
    header: "Name",
  }),
  columnHelper.accessor("beer.brewery", {
    header: "Brewery",
  }),
  columnHelper.accessor("beer.style", {
    header: "Style",
  }),
  columnHelper.accessor("average_rating", {
    header: "Note",
    cell: (info) => info.getValue() || "-",
  }),
];

const BeerRatingsTable = ({ data }: BeerRatingsTableProps) => {
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

export default BeerRatingsTable;
