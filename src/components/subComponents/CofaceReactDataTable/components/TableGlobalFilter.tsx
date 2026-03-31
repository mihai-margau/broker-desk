import * as React from "react";
import { Input } from "../../../../shadcn-ui/components/ui/input";
import { useTableContext } from "../context/TableContext";

export const TableGlobalFilter = () => {
  const { table, tableOptions } = useTableContext();
  //   const [filter, setFilter] = React.useState(table?.getState().globalFilter);
  //   React.useEffect(() => {
  //     setFilter(globalFilter);
  //   }, [globalFilter]);
  if (tableOptions.showGlobalFilter) {
    return (
      
  <div className="w-full lg:order-1 order-2">
    <Input
      id="globalsearchFilter"
      type="text"
      value={table?.getState().globalFilter}
      onChange={(e) => table?.setGlobalFilter(e.target.value)}
      placeholder="Search current results..."
      className="w-full flex items-center justify-between pr-1 py-2 bg-white border border-border rounded hover:bg-neutral-100 hover:border-black active:bg-neutral-200 active:border-primaryactive font-semibold outline-none"
    />
  </div>


    );
  } else return <></>;
};
