import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../shadcn-ui/components/ui/select";
import { clsx } from "clsx";
import { useTableContext } from "../context/TableContext";
import { JSX } from "react";

function TablePagination(): JSX.Element {
  const { table, tableOptions } = useTableContext();
  return (
    <>
      {table ? (
        <div className="flex justify-end pt-2">
          <div className="mr-2">
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="font-semibold rounded-md border border-border outline-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select the page size</SelectLabel>
                  {tableOptions.pageSizes?.map((pageSize) => (
                    <SelectItem
                      key={pageSize}
                      value={pageSize.toString()}
                      className="cursor-pointer"
                    >
                      <span className="font-semibold">{pageSize} per page</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border flex w-fit divide-x divide-border border-border items-center">
            <div className="font-semibold py-1 px-2 text-nowrap h-full flex items-center">
              {table.getState().pagination.pageIndex === 0
                ? 1
                : table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1}{" "}
              -{" "}
              {table.getState().pagination.pageIndex === 0
                ? table.getState().pagination.pageSize
                : table.getCanNextPage()
                ? (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize
                : table.getRowCount().toLocaleString()}{" "}
              of {table.getRowCount().toLocaleString()}
            </div>
            <button
              className={clsx(
                "font-semibold py-1 px-3 cursor-pointer h-full",
                table.getCanPreviousPage() &&
                  "text-primary hover:bg-neutral-100 hover:rounded-r-md active:bg-neutral-200 active:border-primaryactive",
                !table.getCanPreviousPage() && "text-neutral-300"
              )}
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.previousPage();
              }}
            >
              ❮
            </button>
            <button
              className={clsx(
                "font-semibold py-1 px-3 cursor-pointer h-full",
                table.getCanNextPage() &&
                  "text-primary hover:bg-neutral-100 hover:rounded-r-md active:bg-neutral-200 active:border-primaryactive",
                !table.getCanNextPage() && "text-neutral-300"
              )}
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              ❯
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default TablePagination;
