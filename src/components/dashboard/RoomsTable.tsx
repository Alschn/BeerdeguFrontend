"use client";

import { Paper, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { BaseSyntheticEvent, FC } from "react";
import type { Room } from "~/api/types";

interface RoomsTableProps {
  initialData: Room[];
}

const columnHelper = createColumnHelper<Room>();

const columns = [
  columnHelper.accessor("id", {
    header: "#",
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("host", {
    header: "Host",
    cell: (info) => info.getValue().username,
  }),
  columnHelper.accessor("state", {
    header: "State",
  }),
  columnHelper.accessor((row) => `${row.users_count}/${row.slots}`, {
    header: "Slots",
  }),
  columnHelper.accessor("has_password", {
    header: "Password",
  }),
];

const RoomsTable: FC<RoomsTableProps> = ({ initialData }) => {
  const table = useReactTable({
    data: initialData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: (rows) => {
      console.log({ rows });
    },
  });

  // todo: room join modal on row click
  const [isOpenModal, modalHandlers] = useDisclosure(false);

  const handleRowClick = (row: Room) => {
    // todo: modal
    alert("Not implemented");
  };

  return (
    <Paper p={4}>
      <Table verticalSpacing="md" fontSize="sm" highlightOnHover>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              role="button"
              onClick={() => handleRowClick(row.original)}
              style={{ cursor: "pointer" }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};

export default RoomsTable;
