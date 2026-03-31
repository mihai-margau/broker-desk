"use client";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../shadcn-ui/components/ui/dropdown-menu";
import { Button } from "../../../../shadcn-ui/components/ui/button";
import { useTableContext } from "../context/TableContext";
import Link from "next/link";

export const TableColumnsVisibility = () => {
  const { table, tableOptions } = useTableContext();
  const columnOrder = table?.getState().columnOrder;
  const setColumnOrder = table?.setColumnOrder;

  const moveColumn = (index: number, direction: number) => {
    const newOrder = [...columnOrder?.slice() || []];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    // setColumnOrder(newOrder);
  };

  if (!tableOptions.columnsVisibilityToggle) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        
      <Link href="#" 
          // variant="outline"
          className="ml-auto flex justify-end items-center relative min-w-fit lg:w-auto pl-1 lg:px-8 py-2 bg-white border border-primary rounded hover:bg-neutral-100 hover:border-primaryhover active:bg-neutral-200 active:border-primaryactive font-semibold outline-none"
        >
          <svg
            className="h-6 mr-1 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zM4.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h1V3zm5 10V3h-3v10zm1 0h1a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-1z"
            />
          </svg>
          <span className="hidden lg:inline">Columns</span>
        </Link>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-[1px] border-border divide-y divide-border bg-white shadow-md w-full">
        <DropdownMenuLabel>Show/hide columns</DropdownMenuLabel>
        <div className="max-h-[300px] overflow-y-auto space-y-1 px-2 py-1">
          {columnOrder?.map((columnId, index) => {
            const column = table?.getColumn(columnId);
            if (!column || !column.getCanHide()) return null;

            return (
              <div key={column.id} className="flex items-center justify-between gap-2">
                <DropdownMenuCheckboxItem
                  className="capitalize cursor-pointer flex-1"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                 <span className="font-semibold">{column?.columnDef?.header =='' ? '': column?.columnDef?.header?.toString() }</span>
                </DropdownMenuCheckboxItem>
                {/* <div className="flex gap-1">
                    <button
                    onClick={() => moveColumn(index, -1)}
                    disabled={index === 0}
                    className="text-2xl px-1 text-gray-600 hover:text-black"
                    title="Move up"
                    >
                    ↑
                    </button>
                  <button
                    onClick={() => moveColumn(index, 1)}
                    disabled={index === columnOrder.length - 1}
                    className="text-2xl px-1 text-gray-600 hover:text-black"
                    title="Move down"
                  >
                    ↓
                  </button> 
                </div> */}
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};