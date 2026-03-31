"use client";
import * as React from "react";

import { TableSaveViewsPopover } from "./TableSaveViewsPopover";
import { TableViewsPopover } from "./TableViewsPopover";
import { useTableContext } from "../context/TableContext";

export const TableViews = () => {
  const { table, tableOptions } = useTableContext();
  if (tableOptions.showViews && table)
    return (
      <div className="flex justify-end gap-1">
        <TableViewsPopover />
        <TableSaveViewsPopover />
        {/* <Button
          variant="default"
          className="min-w-fit lg:w-auto flex items-center justify-center px-8 py-2 bg-primary border border-primary rounded text-white hover:bg-primaryhover hover:border-primaryhover active:bg-primaryactive active:border-primaryactive font-semibold"
        >
          <span>Save view</span>
        </Button> */}
      </div>
    );
  else return <></>;
};
