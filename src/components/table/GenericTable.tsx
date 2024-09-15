import { Flex, Table, type TableProps } from "@mantine/core";
import { type Table as ReactTable, flexRender } from "@tanstack/react-table";
import SortingIndicator from "./SortingIndicator";

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
    <Table verticalSpacing="md" fontSize="sm" highlightOnHover {...rest}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                {...(header.column.getCanSort()
                  ? { onClick: header.column.getToggleSortingHandler() }
                  : {})}
                style={{
                  cursor: header.column.getCanSort() ? "pointer" : "default",
                }}
              >
                <Flex align="center" gap={1}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  <SortingIndicator
                    canSort={header.column.getCanSort()}
                    direction={header.column.getIsSorted()}
                  />
                </Flex>
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
    </Table>
  );
}
