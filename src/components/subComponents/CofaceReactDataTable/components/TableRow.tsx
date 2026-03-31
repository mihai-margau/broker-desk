import { Row } from "@tanstack/react-table";
import * as React from "react";
import TableCell from "./TableCell";
import { JSX } from "react";

type TableRowProps<TData> = {
  tableRow: Row<TData>;
};

function TableRow<TData>({ tableRow }: TableRowProps<TData>): JSX.Element {
  return (
    <tr className="bg-white hover:bg-cyan-50 hover:cursor-pointer">
      {tableRow.getVisibleCells().map((cell) => (
        <TableCell key={tableRow.id} tableCell={cell}/>
      ))}
    </tr>
  );
}

export default TableRow;
