import { useSortable } from "@dnd-kit/sortable";
import { Cell, flexRender } from "@tanstack/react-table";
import * as React from "react";
import { CSSProperties } from "react";

type TData = any; // Define TData type as needed

const DragAlongCell = ({ cell }: { cell: Cell<TData, unknown> }) => {
    const { isDragging, setNodeRef, transform } = useSortable({
      id: cell.column.id,
    })
  
    const style: CSSProperties = {
      opacity: isDragging ? 0.8 : 1,
      position: 'relative',
      transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined, // translate instead of transform to avoid squishing
      transition: 'width transform 0.2s ease-in-out',
      width: cell.column.getSize(),
      zIndex: isDragging ? 1 : 0,
      padding: '0.5rem 0.5rem 0.5rem 3rem',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 600
    }
  
    return (
      <td style={style} ref={setNodeRef}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    )
  }
  export default DragAlongCell;