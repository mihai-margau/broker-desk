import * as React from "react";
import { Row } from "@tanstack/react-table";
import TableRow from "./TableRow";
// import { Skeleton } from "../../../../../../shadcn-ui/components/ui/skeleton";
//import { Skeleton } from "shadcn-ui/components/ui/skeleton";
import { useTableContext } from "../context/TableContext";
import { JSX } from "react";

function TableBody<TData>(): JSX.Element {
  const { table, loading } = useTableContext<TData>();
  const tableRows: Row<TData>[] | undefined = table?.getRowModel().rows;
  const skeleton = table?.getAllColumns().map((c) => (
    <td key={c.id} className="px-4 py-4">
      {/* <Skeleton className="h-6 w-full" /> */}
    </td>
  ));
  return (
    <tbody>
      {loading ? (
        [...Array(5)].map((_, i) => <tr key={i}>{skeleton}</tr>)
      ) : tableRows?.length ? (
        tableRows?.map((row) => <TableRow key={row.id} tableRow={row} />)
      ) : (
        <tr>
          <td colSpan={table?.getAllColumns().length}>
            <p className="w-full items-center font-semibold p-8">
              There is no data to display. Start by providing keywords to search
              all tools.
            </p>
          </td>
        </tr>
      )}
    </tbody>
  );
}

export default TableBody;
