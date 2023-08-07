import { Table as MantineTable, type TableProps } from "@mantine/core";
import { type Table as ReactTable, flexRender } from "@tanstack/react-table";

interface GenericTableProps<T = unknown> extends TableProps {
  table: ReactTable<T>;
  isLoading?: boolean;
}

export default function GenericTable<TTable>({
  table,
  isLoading,
  ...rest
}: GenericTableProps<TTable>) {
  // todo: loading state

  return (
    <MantineTable verticalSpacing="md" fontSize="sm" highlightOnHover {...rest}>
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
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </MantineTable>
  );
}
