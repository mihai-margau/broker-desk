import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  Table,
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  Updater,
} from "@tanstack/react-table";
import { CofaceDataTableOptions } from "../types";
import { IViewsFiltersListItem } from "@/models/models";
// import { IViewsFiltersListItem } from "@/models/models";
// import { WorkflowType } from "../../DashboardDataTable/types/types";
// import { IViewsFiltersListItem } from "../../../../Services/IViewsFiltersListListItem";
// import {
//   LookupDropdown,
//   LookupItem,
//   IRequestsListListItem,
// } from "../../../../Services/IRequestsListListItem";

// interface WorkflowTypesFilter {
//     id: number;
//     value: string;
// }
interface TableContextType<TData> {
  table: Table<TData> | null;
  tableState: TableState;
  setTableState: React.Dispatch<React.SetStateAction<TableState>>;
  exportState: () => string;
  importState: (stateJson: string) => void;
  tableOptions: CofaceDataTableOptions;
  setTableOptions: React.Dispatch<React.SetStateAction<CofaceDataTableOptions>>;
  // workflowTypes: WorkflowType[];
  requestFormUrl: string;
  viewsFilter: IViewsFiltersListItem[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  globalView: string;
  updateGlobalView: (globalV: string) => void;
  updatePageWorkflowUrl: (url: string) => void;
  updateColumnFilters: (filters: ColumnFiltersState) => void;
  updateTableData: (data: TData[]) => void;
  resetTable: () => void;
  // updateworkflowTypesFilters: (filters: any[]) => void;
  updateViewsFiltersListItemFiltred: (filters: any[]) => void;
  onSearch: (
    globalviewParm: string,
    // wkfTypeFilters: WorkflowType[],
    viewFilterFiltred: IViewsFiltersListItem[]
  ) => Promise<void>;
  defaultQueryMessage: string;
}

const TableContext = React.createContext<TableContextType<any> | undefined>(
  undefined
);

export const useTableContext = <TData,>() => {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

// Define Table State Interface
interface TableState {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  viewsFiltersListItemFiltred: IViewsFiltersListItem[];
  requestFormUrl: string;
  defaultQueryMessage: string;
  columnOrder: string[];
}

interface TableProviderProps<TData> {
  children: React.ReactNode;
  data: TData[];
  columns: ColumnDef<TData>[];
  options: CofaceDataTableOptions;
  // workflowTypes: WorkflowType[];
  viewsFilter: IViewsFiltersListItem[];
  requestFormUrl: string;
  search: (
    queryString: string,
    // workflowTypesFilters: WorkflowType[],
    viewFilterFiltred: IViewsFiltersListItem[]
  ) => Promise<void>;
  defaultQueryMessage: string;
}

export const defaultOptions: CofaceDataTableOptions = {
  pageSizes: [10, 20, 50, 100],
  columnsVisibilityToggle: true,
  showGlobalFilter: true,
  showViews: true,
  views: [],
  selectedView: undefined,
};

export const TableProvider = <TData,>({
  children,
  data,
  columns,
  options,
  viewsFilter,
  requestFormUrl,
  search,
  defaultQueryMessage,
}: //search,
TableProviderProps<TData>) => {
  const [tableData, setTableData] = React.useState<TData[]>([]);

  const [tableOptions, setTableOptions] =
    React.useState<CofaceDataTableOptions>({
      ...Object.assign(defaultOptions, options),
    });

  React.useEffect(() => {
    const newTableOptions = Object.assign(defaultOptions, options);
    setTableOptions((prev) => ({
      ...prev,
      ...newTableOptions, // ✅ Ensures a new object reference
    }));
  }, [options]);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [globalView, setGlobalView] = React.useState<string>("1");

  const [tableState, setTableState] = React.useState<TableState>({
    pagination: { pageIndex: 0, pageSize: tableOptions.pageSizes?.[0] || 10 },
    sorting: [],
    columnVisibility: { RequestDescription: false },
    columnFilters: [],
    globalFilter: "",
    viewsFiltersListItemFiltred: [],
    requestFormUrl: requestFormUrl,
    defaultQueryMessage,
    columnOrder: [], // will be filled dynamically
  });

  const updateColumnFilters = (filters: ColumnFiltersState) => {
    setTableState((prev) => ({ ...prev, columnFilters: filters }));
  };
  const updatePageWorkflowUrl = (url: string) => {
    setTableState((prev) => ({ ...prev, pageWorkflowUrl: url }));
  };

  const updateViewsFiltersListItemFiltred = (
    viewFilterListItem: IViewsFiltersListItem[]
  ) => {
    setTableState((prev) => ({
      ...prev,
      viewsFiltersListItemFiltred: viewFilterListItem,
    }));
  };

  // const updateworkflowTypesFilters = (wkfTypeFilters: WorkflowType[]) => {
  //   setTableState((prev) => ({
  //     ...prev,
  //     workflowTypesFiltred: wkfTypeFilters,
  //   }));
  // };

  const updateTableData = (data: TData[]) => {
    setTableData(data);
  };

  const updateGlobalView = (globalView: string) => {
    setGlobalView(globalView);
  };

  const onSearch = async (
    globalviewParm: string,
    viewFilterFiltred: IViewsFiltersListItem[]
  ) => {
    setLoading(true);
    // console.log("global filter: ", globalviewParm);
    await search(globalviewParm, viewFilterFiltred);
    setTimeout(() => setLoading(false), 1000);
  };

  React.useEffect(() => {
    if (data?.length > 0) {
      console.log("Data length > 0, updating table data with loading state");
      setLoading(true);
      setTableData(data);
      setTimeout(() => setLoading(false), 1000);
    } else setTableData(data);
  }, [data]);

  const table = useReactTable<TData>({
    data: tableData,
    columns,
    state: tableState,
    defaultColumn: {
      size: 200, //starting column size
      minSize: 200, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
    onPaginationChange: (updater) => {
      setTableState((prev) => ({
        ...prev,
        pagination:
          typeof updater === "function" ? updater(prev.pagination) : updater,
      }));
    },

    onColumnOrderChange: (updater) => {
      setTableState((prev) => ({
        ...prev,
        columnOrder:
          typeof updater === "function" ? updater(prev.columnOrder) : updater,
      }));
    },

    onSortingChange: (updater) => {
      setTableState((prev) => ({
        ...prev,
        sorting:
          typeof updater === "function" ? updater(prev.sorting) : updater,
      }));
    },
    // onSortingChange: (sorting: SortingState) =>
    //   setTableState((prev) => ({ ...prev, sorting })),
    onColumnVisibilityChange: (updater) => {
      setTableState((prev) => ({
        ...prev,
        columnVisibility:
          typeof updater === "function"
            ? updater(prev.columnVisibility)
            : updater,
      }));
    },

    // onColumnVisibilityChange: (columnVisibility: VisibilityState) =>
    //   setTableState((prev) => ({ ...prev, columnVisibility })),
    onColumnFiltersChange: (updaterOrValue: Updater<ColumnFiltersState>) =>
      setTableState((prev) => ({
        ...prev,
        columnFilters:
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev.columnFilters)
            : updaterOrValue,
      })),
    onGlobalFilterChange: (globalFilter) => {
      setTableState((prev) => ({
        ...prev,
        globalFilter:
          typeof globalFilter === "function"
            ? globalFilter(prev.globalFilter) // Ensure functional updates work
            : globalFilter,
      }));
    },
    // onGlobalFilterChange: (globalFilter) =>
    //   setTableState((prev) => ({ ...prev, globalFilter })),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  React.useEffect(() => {
    if (table) {
      const allColumnIds = table.getAllLeafColumns().map((col) => col.id);
      const currentOrder = tableState?.columnOrder || [];

      const updatedOrder = [
        ...new Set([
          ...currentOrder.filter((id) => allColumnIds.includes(id)),
          ...allColumnIds,
        ]),
      ];

      setTableState((prev) => ({
        ...prev,
        columnOrder: updatedOrder,
      }));
    }
  }, [table, columns]);

  // Export Table State as JSON
  const exportState = () => JSON.stringify(table.getState());

  // Import Table State from JSON
  const importState = (stateJson: string) => {
    try {
      const newState = JSON.parse(stateJson);
      const allColumnIds = table.getAllLeafColumns().map((col) => col.id);

      const mergedOrder = [
        ...new Set([...(newState.columnOrder || []), ...allColumnIds]),
      ];

      setTableState((prev) => ({
        ...prev,
        ...newState,
        columnVisibility: {
          ...(options?.views && options.views[0]?.IsDefault
            ? { RequestDescription: false }
            : {}),
          ...newState.columnVisibility,
        },
        columnOrder: mergedOrder, // ✅ ensures drag-and-drop works
      }));
    } catch (error) {
      console.error("Invalid table state JSON:", error);
    }
  };

  //Reset the table state
  const resetTable = () => {
    const allColumnIds = table.getAllLeafColumns().map((col) => col.id);
    const state = {
      pagination: { pageIndex: 0, pageSize: tableOptions.pageSizes?.[0] || 10 },
      sorting: [],
      columnVisibility: { RequestDescription: false },
      columnFilters: [],
      globalFilter: "",
      viewsFiltersListItemFiltred: [],
      requestFormUrl: requestFormUrl,
      defaultQueryMessage,
      columnOrder: allColumnIds,
    };
    try {
      setTableState((prev) => ({ ...prev, ...state }));
    } catch (error) {
      console.error("Invalid table state JSON:", error);
    }
  };

  return (
    <TableContext.Provider
      value={{
        table,
        tableState,
        setTableState,
        exportState,
        importState,
        tableOptions,
        setTableOptions,
        requestFormUrl,
        viewsFilter,
        loading,
        setLoading,
        globalView,
        updateGlobalView,
        updatePageWorkflowUrl,
        updateColumnFilters,
        resetTable,
        updateTableData,
        updateViewsFiltersListItemFiltred,
        onSearch,
        defaultQueryMessage,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
