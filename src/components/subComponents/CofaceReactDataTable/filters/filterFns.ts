import { FilterFn, Row } from "@tanstack/react-table";
import { Filter } from "../types";
import {
  compareAsc,
  isAfter,
  isBefore,
  format,
  parse,
  parseISO,
} from "date-fns";

export const TextMultiFilter: FilterFn<any> = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: Filter[]
) => {
  if (!filterValue || filterValue.length === 0) return true; // No filters applied

  const rowValue =
    row.getValue<string>(columnId)?.toString().toLowerCase() || "";
  const filterResults = filterValue.map((filter: Filter) => {
    const value = filter.value.toLowerCase();
    switch (filter.selectedOperator) {
      case "contains":
        return rowValue.includes(value);
      case "equals":
        return rowValue === value;
      case "doesNotContain":
        return !rowValue.includes(value);
      default:
        return true;
    }
  });

  return filterResults.some((result) => result);
};

export const DateMultiFilter: FilterFn<any> = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: Filter[]
) => {
  if (!filterValue || filterValue.length === 0) return true; // No filters for the column

  const rowValue = row.getValue<string>(columnId);

  if (!rowValue || isNaN(Date.parse(rowValue))) return true; // If the row's value is not a valid date, return true

  // Parse the row's value as a Date object
  const parsedRowValue = parseISO(rowValue);

  // Apply each filter condition (AND logic across different filter types)
  const filterResults = filterValue.map((filter: Filter) => {
    const value = parseISO(filter.value);
    switch (filter.selectedOperator) {
      case "equals":
        return compareAsc(parsedRowValue, value) === 0;
      case "greaterThan":
        return isAfter(parsedRowValue, value);
      case "lessThan":
        return isBefore(parsedRowValue, value);
      case "lessThanOrEqual":
        return (
          isBefore(parsedRowValue, value) ||
          compareAsc(parsedRowValue, value) === 0
        );
      case "greaterThanOrEqual":
        return (
          isAfter(parsedRowValue, value) ||
          compareAsc(parsedRowValue, value) === 0
        );
      default:
        return true;
    }
  });

  return filterResults.some((result) => result);
};

export const NumberMultiFilter: FilterFn<any> = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: Filter[]
) => {
  if (!filterValue || filterValue.length === 0) return true; // No filters for the column

  const rowValue = row.getValue<number>(columnId);

  if (typeof rowValue !== "number" || isNaN(rowValue)) return true; // If the row's value is not a valid date, return true

  // Parse the row's value as a Date object
  const parsedRowValue = Number(rowValue);

  // Apply each filter condition (AND logic across different filter types)
  const filterResults = filterValue.map((filter: Filter) => {
    const value = Number(filter.value);
    switch (filter.selectedOperator) {
      case "equals":
        return parsedRowValue === value;
      case "greaterThan":
        return parsedRowValue > value;
      case "lessThan":
        return parsedRowValue < value;
      case "lessThanOrEqual":
        return parsedRowValue <= value;
      case "greaterThanOrEqual":
        return parsedRowValue >= value;
      default:
        return true;
    }
  });

  return filterResults.some((result) => result);
};
