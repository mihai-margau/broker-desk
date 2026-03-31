import { Cell, flexRender } from "@tanstack/react-table";
import { clsx } from "clsx";
import * as React from "react";
import { JSX } from "react";

type TableCellProps<TData, TValue> = {
  tableCell: Cell<TData, TValue>;
};

function TableCell<TData, TValue>({
  tableCell,
}: TableCellProps<TData, TValue>): JSX.Element {
  return (
    <td
      className={clsx(
        "p-2 whitespace-nowrap font-semibold",
        Boolean(tableCell.column.getIsSorted()) && "bg-cyan-50"
      )}
      style={{
        width: tableCell.column.getSize(),
        minWidth: tableCell.column.getSize(),
      }}
    >
      <div className="w-full flex items-center justify-center">
        <div className="text-justify">
          {flexRender(tableCell.column.columnDef.cell, tableCell.getContext())}
        </div>
      </div>
    </td>
  );
}

export default TableCell;
