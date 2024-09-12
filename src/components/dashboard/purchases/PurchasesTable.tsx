"use client";

import { Flex, Image, Text, createStyles } from "@mantine/core";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { BeerPurchase } from "~/api/types";
import GenericTable from "~/components/GenericTable";
import { capitalize } from "~/utils/text";

const columnHelper = createColumnHelper<BeerPurchase>();

const BeerCell = ({ beer }: { beer: BeerPurchase["beer"] }) => {
  return (
    <Flex gap={8} align="center">
      <Image
        src={beer.image}
        width={80}
        height={80}
        fit="contain"
        alt="Beer"
        withPlaceholder
      />
      <Flex direction="column">
        <Text size="xl" weight={700}>
          {beer.name}
        </Text>
        <Text size="md" weight={300}>
          {beer.percentage} % {!!beer.extract && `${beer.extract} BLG`}
        </Text>
      </Flex>
    </Flex>
  );
};

const columns = [
  columnHelper.accessor("id", {
    header: "#",
    enableSorting: false,
  }),
  columnHelper.accessor("beer", {
    id: "beer",
    header: "Beer",
    cell: (props) => {
      const beer = props.getValue();
      return <BeerCell beer={beer} />;
    },
    enableSorting: false,
  }),
  columnHelper.accessor("beer.style.name", {
    header: "Style",
    cell: (props) => props.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor("beer.brewery.name", {
    header: "Brewery",
    cell: (props) => props.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor("packaging", {
    header: "Packaging",
    cell: (props) => capitalize(props.getValue()),
    enableSorting: false,
  }),
  columnHelper.accessor("volume_ml", {
    header: "Volume",
    cell: (props) => `${props.getValue()} ml`,
    enableSorting: false,
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (props) => `${props.getValue()} zł`,
    enableSorting: true,
  }),
  columnHelper.accessor("purchased_at", {
    header: "Purchase date",
    cell: (props) => new Date(props.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    enableSorting: false,
  }),
];

interface PurchasesTableProps {
  data: BeerPurchase[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading?: boolean;
}

const useStyles = createStyles((theme) => ({
  table: {
    "& th": {
      position: "sticky",
      top: 0,
      zIndex: 2,
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "white",
    },
    // second td of each row
    "& td:nth-child(2)": {
      paddingLeft: 0,
      maxWidth: 300,
    },
  },
}));

const PurchasesTable = ({
  data,
  isLoading,
  sorting,
  onSortingChange,
}: PurchasesTableProps) => {
  const { classes } = useStyles();

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    onSortingChange: onSortingChange,
    state: {
      sorting,
    },
  });

  return (
    <GenericTable
      table={table}
      className={classes.table}
      isLoading={isLoading}
    />
  );
};

export default PurchasesTable;
