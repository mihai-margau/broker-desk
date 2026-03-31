import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CofaceDataTableOptions } from "./types";
import { TableProvider } from "./context/TableContext";
import { Toaster as SonnerToaster, Toaster } from "sonner";
// import { LookupDropdown } from "../../../../servicingToolWorkflowForm/components/subcomponents/IRequestsListItems";
// import { IViewsFiltersListItem } from "../../../Services/IViewsFiltersListListItem";
import { JSX } from "react";
import { IViewsFiltersListItem } from "@/models/models";
type Props<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  options: CofaceDataTableOptions;
  children?: React.ReactNode;
  viewsFilter: IViewsFiltersListItem[];
  requestFormUrl: string;
  search: (
    queryString: string,
    viewFilterFiltred: IViewsFiltersListItem[]
  ) => Promise<void>;
  defaultQueryMessage: string;
};

export const CofaceReactDataTableWrapper = <TData, TValue>(
  props: Props<TData, TValue>
): JSX.Element => {
  return (
    <TableProvider
      data={props.data}
      columns={props.columns}
      options={props.options}
      viewsFilter={props.viewsFilter}
      requestFormUrl={props.requestFormUrl}
      search={(queryString, viewFilterFiltred) =>
        props.search(queryString, viewFilterFiltred)
      }
      defaultQueryMessage={props.defaultQueryMessage}
    >
      {props.children}
      <Toaster />
    </TableProvider>
  );
};
