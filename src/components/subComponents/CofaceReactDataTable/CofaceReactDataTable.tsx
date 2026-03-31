/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { Button } from "../../../shadcn-ui/components/ui/button";
import { TableColumnsVisibility } from "./components/TableColumnsVisibility";
// import { TableGlobalFilter } from "./components/TableGlobalFilter";
import { DraggableTableHeader } from "./components/TableHeader";
import TableBody from "./components/TableBody";
import TablePagination from "./components/TablePagination";
import { TableViews } from "./components/TableViews";
// import { TableGlobalColumnFilterPopover } from "./components/TableGlobalColumnFilterPopover";
import { useTableContext } from "./context/TableContext";
import { ChangeEvent } from "react";
import { TableCurrentFilters } from "./components/TableCurrentFilters";
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import DragAlongCell from "./DragAlongCell";
// import { WebPartContext } from "@microsoft/sp-webpart-base";
import { JSX } from "react/jsx-runtime";
import Link from "next/link";
import { TableGlobalFilter } from "./components/TableGlobalFilter";
// import { TableCurrentGlobalFilters } from "./components/TableCurrentGlobalFilters";
// import { TableGlobalColumnFilterPopover } from "./components/TableGlobalColumnFilterPopover";
type TableGlobalColumnFilterPopoverProps = {
};
export const CofaceReactDataTable = React.forwardRef<HTMLTableElement, TableGlobalColumnFilterPopoverProps>(
  ({  }, ref): JSX.Element => {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  const {
    table,
    tableState,
    tableOptions,
    globalView,
    requestFormUrl,
    updateViewsFiltersListItemFiltred,
    updateGlobalView,
    setLoading,
    importState,
    resetTable,
    onSearch,
  } = useTableContext();
  const columnOrder = table?.getState().columnOrder;
  const setColumnOrder = table?.setColumnOrder;
  
  // if (!setColumnOrder) {
  //   console.error("setColumnOrder is undefined");
  //   return null; // or handle the error as needed
  // }
  const [keywords, setKeywords] = React.useState<string>("1");
  React.useEffect(() => {
    if (tableOptions?.views && tableOptions.views.length > 0) {
      const findDefaultView = tableOptions.views.find(
        (f) => f.IsDefault === true
      );
      if (findDefaultView) {
        setLoading(true);
        importState(findDefaultView.Configuration);
        setTimeout(() => setLoading(false), 2000);
      } else {
        resetTable();
      }
    } else {
      resetTable();
    }
  }, [tableOptions]);

  const handleKeywordsKeyPress = async (event: any) => {
    if (event.key === "Enter") {
      await onSearch(keywords, []);
    }
  };

  const onGlobalViewChanged = async (globalViewParm: string) => {
    //{() => setGlobalView("2")}
    updateGlobalView(globalViewParm);
    await onSearch(
      globalViewParm,
      tableState.viewsFiltersListItemFiltred
    );
  };

  // const handleKeywordsChange = (event: ChangeEvent<HTMLInputElement>): void => {
  //     setKeywords(event.target.value);
  //     setColumnOrder?.(columnOrder => {
  function handleDragEnd(event: DragEndEvent) {
    console.log('Drag ended: ', event);
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder?.(columnOrder => {
        const oldIndex = columnOrder.indexOf(active.id as string)
        const newIndex = columnOrder.indexOf(over.id as string)
        return arrayMove(columnOrder, oldIndex, newIndex) //this is just a splice util
      })
      console.log('columnOrder : ', columnOrder);
    }
  }
  return (
    <div id="CofaceDataTable">
      <div className="mt-4 rounded-xl border-[1px] border-border divide-y divide-border bg-white shadow-md w-full">
        {/* Header Views Buttons */}
        <div className="p-4 grid sm:grid-flow-row-dense xs:grid-cols-1 lg:flex items-center justify-center gap-y-2">
          <div className="flex justify-end gap-1">
            
          <Link href="/request/create" 
              className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-5 py-5 bg-primary border border-primary rounded text-white hover:bg-primaryhover hover:border-primaryhover active:bg-primaryactive active:border-primaryactive font-semibold hover:text-white"
            >
              Add New Request
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl border-[1px] border-border divide-y divide-border bg-white shadow-md w-full">
        {/* Table Features : Search, Columns visibility, Views */}
        <div className="p-4 flex items-center gap-y-2">
          <div className="flex-grow flex justify-start">
            <TableGlobalFilter /> 
          </div> 
          <div className="flex gap-x-1 justify-end items-center lg:pl-1">
            <TableColumnsVisibility />
            <TableViews />
          </div>
        </div>
        {/* <div className="p-4 grid sm:grid-flow-row-dense xs:grid-cols-1 lg:flex items-center gap-y-2">
          <div className="lg:order-1 md:grow order-2 relative col-span-1 lg:col-span-2 xl:col-end-8 lg:col-start-1 justify-end">
          <TableCurrentGlobalFilters />
          </div>
          <div className="order-1 lg:order-3 xs:col-span-1 flex gap-x-1 justify-end items-center relative lg:pl-1">
            
          </div>
        </div> */}
        <TableCurrentFilters />
     <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          > 
        <div className="overflow-x-hidden pb-2">
          <div className="pb-2 block overflow-x-scroll scrollbar-thin">
            <table ref={ref} className="divide-y divide-border w-full cursor-default">
            <thead className="h-14 text-neutral-600 relative">
            {table?.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                <SortableContext
                  items={columnOrder || []}
                  strategy={horizontalListSortingStrategy}
                >
                  {/* {headerGroup.headers.map(header => ( */}
                   <DraggableTableHeader key={headerGroup.id} header={headerGroup.headers[0]} />
                  {/* ))} */}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <tbody>
            {table?.getRowModel()?.rows?.map(row => (
              <tr key={row.id} className="bg-white hover:bg-cyan-50 hover:cursor-pointer">
                {row.getVisibleCells().map(cell => (
                  <SortableContext
                    key={cell.id}
                    items={columnOrder || []}
                    strategy={horizontalListSortingStrategy}
                  >
                    <DragAlongCell key={cell.id} cell={cell} />
                  </SortableContext>
                ))}
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        </div>
        </DndContext>
      </div>
      {/* Pagination */}
      <TablePagination />
    </div>
  );
});
