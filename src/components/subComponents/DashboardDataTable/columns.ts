import { ColumnDef } from "@tanstack/react-table";
import { DataGridRowItem } from "./types/types";
import { CofaceReactDataTableColumnTypes } from "../CofaceReactDataTable/types";
import {
  DateMultiFilter,
  NumberMultiFilter,
  TextMultiFilter,
} from "../CofaceReactDataTable/filters/filterFns";

export const columns: ColumnDef<DataGridRowItem>[] = [
  {
    header: "ID",
    accessorKey: "id",
    meta: {
      columnType: CofaceReactDataTableColumnTypes.Number,
    },
    filterFn: NumberMultiFilter,
    enableSorting: false,
  },
  {
    header: "Created By",
    accessorKey: "createdBy",
    meta: {
      columnType: CofaceReactDataTableColumnTypes.Text,
    },
  },
  {
    header: "Created",
    accessorKey: "created",
    cell: ({ row }) => {
      const value = row.getValue("created");
      const cellValue = new Date(value as string);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "2-digit", // Always two digits (e.g., '02')
        day: "2-digit", // Always two digits (e.g., '09')
        year: "numeric", // Full year (e.g., '2025')
      }).format(cellValue);
      return formattedDate;
    },
    meta: {
      columnType: CofaceReactDataTableColumnTypes.Date,
    },
    filterFn: DateMultiFilter,
  },
  {
    header: "Status",
    accessorKey: "status",
    meta: {
      columnType: CofaceReactDataTableColumnTypes.Text,
    },
    filterFn: TextMultiFilter,
  },
  {
    header: "Step",
    accessorKey: "step",
    meta: {
      columnType: CofaceReactDataTableColumnTypes.Text,
    },
  },
  {
    header: "Current Approvers",
    accessorKey: "currentApprovers",
    meta: {
      contentType: CofaceReactDataTableColumnTypes.Text,
    },
  },
];
