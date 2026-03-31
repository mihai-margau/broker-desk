import * as React from "react";
import {
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { flexRender, Header } from "@tanstack/react-table";
import { useTableContext } from "../context/TableContext";
import { TableColumnFilterPopover } from "./TableColumnFilterPopover";

export const DraggableTableHeader = ({
  header,
}: {
  header: Header<any, unknown>;
}) => {
  const { table } = useTableContext();
  const columnOrder = table?.getState().columnOrder;
  const headerGroup = table?.getHeaderGroups()[0];

  // Get all headers in columnOrder
  const orderedHeaders = columnOrder
    ?.map((id) => headerGroup?.headers.find((h) => h.column.id === id))
    .filter(Boolean); // includes hidden columns

  return (
    <>
      {orderedHeaders?.map((h) =>
        h?.column.getIsVisible() ? (
          <SortableHeader key={h.column.id} header={h} />
        ) : null
      )}
    </>
  );
};

const SortableHeader = ({ header }: { header: Header<any, unknown> }) => {
  const column = header.column;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  return (
    <th
      ref={setNodeRef}
      colSpan={header.colSpan}
      className="items-left"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition,
        width: column.getSize(),
        minWidth: column.getSize(),
        zIndex: isDragging ? 999 : 0,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="inline">
        <div className="flex px-4 py-4 gap-1">
          {/* 🔹 Drag Handle (moved listeners here to preserve sorting/filter clicks) */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-neutral-400 hover:text-neutral-600 select-none"
            title="Drag to reorder column"
          >
            ☰
          </div>

          {/* 🔸 Column Header */}
          <div className="flex">
            {flexRender(column.columnDef.header, header.getContext())}

            {/* 🔸 Sorting */}
            {column.getCanSort() && (
              <div
                className="ml-2 text-neutral-400 cursor-pointer"
                onClick={() =>
                  column.toggleSorting(
                    column.getIsSorted() === "asc" || !column.getIsSorted()
                  )
                }
              >
                {column.getIsSorted() === "asc" || !column.getIsSorted() ? (
                  <svg
                    className="cursor-pointer"
                    width="18"
                    height="18"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="cursor-pointer"
                    width="18"
                    height="18"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}

            {/* 🔸 Filtering */}
            {column.getCanFilter() && (
              <div className="text-neutral-900">
                <TableColumnFilterPopover column={column} />
              </div>
            )}
          </div>
        </div>
      </div>
    </th>
  );
};
