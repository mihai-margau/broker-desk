import { ColumnDef, FilterFn, TableState } from "@tanstack/react-table";
import {
  DateMultiFilter,
  NumberMultiFilter,
  TextMultiFilter,
} from "./filters/filterFns";

export enum CofaceReactDataTableColumnTypes {
  Text = "Text",
  Number = "Number",
  Date = "Date",
  Dropdown = "Dropdown",
}
export type CofaceReactDataTableColumnMeta = {
  columnType: CofaceReactDataTableColumnTypes;
};

export type CofaceDataTableOptions = {
  pageSizes?: number[];
  columnsVisibilityToggle?: boolean;
  showGlobalFilter?: boolean;
  showViews?: boolean;
  views?: TableView[];
  selectedView?: number | undefined;
  saveView?: (view: TableView) => Promise<void>;
  deleteView?: (view: number) => Promise<void>;
};

export type CofaceDataTableInternalOptions = {
  pageSizes: number[];
  columnsVisibilityToggle: boolean;
  showGlobalFilter: boolean;
  showViews: boolean;
  views: TableView[];
  selectedView: TableView | undefined;
};

export type FilterOperator = {
  title: string;
  types: CofaceReactDataTableColumnTypes[];
  key: string;
};

export type Filter = {
  operators: FilterOperator[];
  selectedOperator: string;
  value: string;
  key: string;
  columnType: CofaceReactDataTableColumnTypes;
  // removeFilter: (key: string) => void;
  // updateFilterSelectedOperator: (key: string, selectedOperator: string) => void;
  // updateFilterValue: (key: string, value: string) => void;
};

// export type FilterCondition = {
//   type:
//     | "contains"
//     | "equals"
//     | "doesNotContain"
//     | "greaterThan"
//     | "greaterThanOrEqual"
//     | "lessThan"
//     | "lessThanOrEqual"; // Types of filters
//   value: string;
// };

export type ColumnFilter = {
  id: string;
  value: Filter[];
};

export type TableView = {
  Id: number;
  BrokerCG: string;
  Title: string;
  Configuration: string;
  IsDefault: boolean;
  Keywords?: string;
  globalFiltersConfig: string;
};

export const filterFunctionMap: Record<string, FilterFn<any>> = {
  DateMultiFilter,
  TextMultiFilter,
  NumberMultiFilter,
};
