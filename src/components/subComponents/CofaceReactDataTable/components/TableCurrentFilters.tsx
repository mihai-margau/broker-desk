import * as React from "react";
import { useTableContext } from "../context/TableContext";
import { Filter } from "../types";
import { ColumnFiltersState } from "@tanstack/react-table";

export const TableCurrentFilters = () => {
  const { tableState, updateColumnFilters } = useTableContext();
  const removeFilter = (key: string, columnId: string) => {
    if (tableState.columnFilters.length > 0) {
      const columnFilters = tableState.columnFilters.find(
        (f) => f.id === columnId
      );
      if (columnFilters) {
        const newFilters = (columnFilters.value as Filter[]).filter(
          (f) => f.key !== key
        );
        if (newFilters.length < 1) {
          const _newFilters: ColumnFiltersState = [
            ...tableState.columnFilters.filter((f) => f.id !== columnId),
          ];
          updateColumnFilters(_newFilters);
        } else {
          const _newFilters: ColumnFiltersState = [
            ...tableState.columnFilters.filter((f) => f.id !== columnId),
            { id: columnId, value: newFilters },
          ];
          updateColumnFilters(_newFilters);
        }
      }
    }
  };
  if (tableState.columnFilters.length > 0) {
    return (
      <div className="p-4 flex flex-row">
        {tableState.columnFilters.map((f) => {
          const filterName = f.id;
          return (
            <div key={f.id} className="flex flex-row">
              {(f.value as Filter[]).map((filter) => {
                return (
                  <div
                    key={filter.key}
                    className="mr-2 flex items-center bg-pill pl-2 pr-2 py-1 rounded-xl text-sm w-full md:w-auto justify-between font-semibold border border-1"
                  >
                    {filterName +
                      " (" +
                      filter.selectedOperator +
                      "): " +
                      filter.value}
                    <span
                      onClick={() => removeFilter(filter.key, f.id)}
                      className="cursor-pointer text-xs ml-2 text-center w-5 h-5 border-neutral-500 border-2 rounded-full text-neutral-500 hover:bg-neutral-100 active:bg-neutral-300 font-bold"
                    >
                      ✖
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  } else return <></>;
};
