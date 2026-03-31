import * as React from "react";
import { v4 as uuid } from "uuid";
import {
  CofaceReactDataTableColumnMeta,
  CofaceReactDataTableColumnTypes,
  Filter,
  FilterOperator,
} from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../shadcn-ui/components/ui/popover";
import { Button } from "../../../../shadcn-ui/components/ui/button";
import { Column, ColumnFiltersState } from "@tanstack/react-table";

import { TableColumnFilter } from "./TableColumnFilter";
import { Label } from "../../../../shadcn-ui/components/ui/label";
import { useTableContext } from "../context/TableContext";
import { JSX } from "react";

export type Props<TData, TValue> = {
  column: Column<TData, TValue>;
  //   title?: string;
  //   children?: React.ReactNode;
  //   open?: boolean;
  //   onClose?: () => void;
};

const operators: FilterOperator[] = [
  {
    title: "Equals",
    types: [
      CofaceReactDataTableColumnTypes.Number,
      CofaceReactDataTableColumnTypes.Text,
      CofaceReactDataTableColumnTypes.Date,
    ],
    key: "equals",
  },
  {
    title: "Contains",
    types: [CofaceReactDataTableColumnTypes.Text],
    key: "contains",
  },
  {
    title: "Does not contain",
    types: [CofaceReactDataTableColumnTypes.Text],
    key: "doesNotContain",
  },
  {
    title: "Greater than",
    types: [
      CofaceReactDataTableColumnTypes.Number,
      CofaceReactDataTableColumnTypes.Date,
    ],
    key: "greaterThan",
  },
  {
    title: "Greater than or equal",
    types: [
      CofaceReactDataTableColumnTypes.Number,
      CofaceReactDataTableColumnTypes.Date,
    ],
    key: "greaterThanOrEqual",
  },
  {
    title: "Less than",
    types: [
      CofaceReactDataTableColumnTypes.Number,
      CofaceReactDataTableColumnTypes.Date,
    ],
    key: "lessThan",
  },
  {
    title: "Less than or equal",
    types: [
      CofaceReactDataTableColumnTypes.Number,
      CofaceReactDataTableColumnTypes.Date,
    ],
    key: "lessThanOrEqual",
  },
];

const MAX_ALLOWED_FILTERS_PER_COLUMN: number = 3;

export function TableColumnFilterPopover<TData, TValue>({
  column,
}: Props<TData, TValue>): JSX.Element {
  const { tableState, updateColumnFilters } = useTableContext();
  const [open, setOpen] = React.useState(false);
  const [selectedColumn, setSelectedColumn] =
    React.useState<Column<TData, TValue>>(column);

  const [filters, setFilters] = React.useState<Filter[]>([]);

  React.useEffect(() => {
    const existingFiltersForColumn = tableState.columnFilters.filter(
      (f) => f.id === selectedColumn.id
    );
    if (existingFiltersForColumn.length > 0) {
      const filtersFromState = existingFiltersForColumn[0].value as Filter[];
      setFilters(filtersFromState);
    } else setFilters([]);
    // if (tableState.columnFilters.length < 1) setFilters([]);
    // else {
    //   const viewFilters = table?.getState().columnFilters;
    //   if (viewFilters) {
    //     if (viewFilters.length > 0) {
    //       viewFilters.forEach((vf) => {
    //         if (vf.id === selectedColumn.id) {
    //           const filtersFromPreviousView = [...filters];
    //           //const exists = filtersFromPreviousView.find((f) => selectedColumn.id === vf.id);
    //           const newFilters: Filter[] = [];
    //           (vf.value as Filter[]).forEach((v) => {
    //             const exists = filtersFromPreviousView.find(
    //               (f) => f.key === v.key
    //             );
    //             const newFilter: Filter = {
    //               operators: v.operators,
    //               selectedOperator: v.selectedOperator,
    //               value: v.value,
    //               key: v.key,
    //               columnType: v.columnType,
    //             };
    //             newFilters.push(newFilter);
    //           });

    //           setFilters([...newFilters]);
    //         }
    //       });
    //     }
    //   }
    // }
  }, [tableState.columnFilters]);

  const removeFilter = (key: string): void => {
    const newFilters = filters.filter((f) => f.key !== key);
    if (newFilters.length < 1) {
      const _newFilters: ColumnFiltersState = [
        ...tableState.columnFilters.filter((f) => f.id !== selectedColumn.id),
      ];
      updateColumnFilters(_newFilters);
    } else {
      const _newFilters: ColumnFiltersState = [
        ...tableState.columnFilters.filter((f) => f.id !== selectedColumn.id),
        { id: selectedColumn.id, value: newFilters },
      ];
      updateColumnFilters(_newFilters);
    }
    setFilters([]);
    setOpen(false);
  };

  const updateFilterValue = (key: string, value: string): void => {
    setFilters(
      filters.map((filter) =>
        filter.key === key ? { ...filter, value } : filter
      )
    );
  };

  const updateFilterSelectedOperator = (
    key: string,
    selectedOperator: string
  ): void => {
    setFilters(
      filters.map((filter) =>
        filter.key === key ? { ...filter, selectedOperator } : filter
      )
    );
  };

  const addNewFilter = (): void => {
    const columnType = (column.columnDef.meta as CofaceReactDataTableColumnMeta)
      .columnType;
    const filteredOperators: FilterOperator[] = operators.filter((filter) => {
      return filter.types.find((f) => f === columnType);
    });
    const key: string = uuid();
    const newFilter: Filter = {
      operators: filteredOperators,
      selectedOperator: "",
      value: "",
      key,
      columnType,
    };
    setFilters([...filters, newFilter]);
  };

  const applyFilters = (): void => {
    const columnId = selectedColumn.id;
    const newFilters: ColumnFiltersState = [
      ...tableState.columnFilters.filter((f) => f.id !== columnId),
      { id: columnId, value: filters },
    ];
    setOpen(false);
    setFilters([]);
    updateColumnFilters(newFilters);
    console.log(filters);
  };

  const clearFilters = (): void => {
    setFilters([]);
    const _newFilters: ColumnFiltersState = [
      ...tableState.columnFilters.filter((f) => f.id !== selectedColumn.id),
    ];
    updateColumnFilters(_newFilters);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  //   console.log(filters);
  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <svg
          className="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 12 12"
          //ref={(element) => filtersRefs.current[i] === element}
        >
          <path
            fill="currentColor"
            d="M1 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m2 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"
          />
        </svg>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] rounded-xl border-[1px] border-border divide-y divide-border bg-white shadow-md w-full">
        <div className="flex flex-col items-start">
          <Label className="font-semibold mb-2 text-secondary">
             Refine search results for {selectedColumn?.columnDef?.header as string} 
          </Label>
          {filters.map((filter, index) => (
            <TableColumnFilter
              filter={filter}
              key={index}
              removeFilter={removeFilter}
              updateFilterValue={updateFilterValue}
              updateFilterSelectedOperator={updateFilterSelectedOperator}
            />
          ))}

          <Button
            variant="ghost"
            className="px-0"
            onClick={addNewFilter}
            disabled={filters.length === MAX_ALLOWED_FILTERS_PER_COLUMN}
          >
            <div className="flex font-semibold text-secondary items-center justify-between py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M4 7a.5.5 0 0 1 .5-.5h2v-2a.5.5 0 0 1 1 0v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2A.5.5 0 0 1 4 7m0-5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM3 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm7.5 9a2.5 2.5 0 0 0 2.5-2.5V3.268A2 2 0 0 1 14 5v5.5a3.5 3.5 0 0 1-3.5 3.5H5a2 2 0 0 1-1.732-1z"
                />
              </svg>
              <span>Add new filter</span>
            </div>
          </Button>
          {filters.length > 0 ? (
            <div className="flex items-center gap-1 pt-2">
              <Button
                variant="secondary"
                onClick={applyFilters}
                className="text-white font-semibold"
              >
                <span>Apply filters</span>
              </Button>
              <Button
                onClick={clearFilters}
                className="text-white font-semibold"
              >
                <span>Clear filters</span>
              </Button>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
