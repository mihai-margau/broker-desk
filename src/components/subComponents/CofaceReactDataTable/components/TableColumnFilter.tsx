import * as React from "react";
import { CofaceReactDataTableColumnTypes, Filter } from "../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../shadcn-ui/components/ui/select";
import { DateField } from "../filters/DateField";
import { NumericField } from "../filters/NumericField";
import { TextField } from "../filters/TextField";
import { JSX } from "react";

type TableColumnFilterProps = {
  filter: Filter;
  removeFilter: (key: string) => void;
  updateFilterValue: (key: string, value: string) => void;
  updateFilterSelectedOperator: (key: string, selectedOperator: string) => void;
};

export const TableColumnFilter = ({
  filter,
  removeFilter,
  updateFilterValue,
  updateFilterSelectedOperator,
}: //   remove,
TableColumnFilterProps): JSX.Element => {
  const onChange = (_value: string): void => {
    updateFilterValue(filter.key, _value);
  };
  const renderInput = React.useCallback(() => {
    switch (filter.columnType) {
      case CofaceReactDataTableColumnTypes.Date:
        return (
          <DateField
            placeholder="Select a date..."
            value={filter.value}
            onChange={onChange}
          />
        );

      case CofaceReactDataTableColumnTypes.Number:
        return (
          <NumericField
            placeholder="Enter a number..."
            value={filter.value}
            onChange={onChange}
          />
        );
      case CofaceReactDataTableColumnTypes.Text:
        return (
          <TextField
            placeholder="Enter a text..."
            value={filter.value}
            onChange={onChange}
          />
        );
      default:
        return (
          <TextField
            placeholder="Enter a text..."
            value={filter.value}
            onChange={() => updateFilterValue(filter.key, filter.value)}
          />
        );
    }
  }, [filter]);
  return (
    <div className="flex w-full">
      <div className="flex w-full mb-1">
        <div className="min-w-[200px]">
          <Select
            value={filter.selectedOperator}
            onValueChange={(value) =>
              updateFilterSelectedOperator(filter.key, value)
            }
          >
            <SelectTrigger className="font-semibold rounded-md border border-border outline-none">
              <SelectValue placeholder="Select an operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Filters for {column}</SelectLabel> */}
                {filter.operators.map((operator, index) => (
                  <SelectItem
                    key={index}
                    value={operator.key}
                    className="cursor-pointer"
                  >
                    <span className="font-semibold">{operator.title}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 pl-1">
          {renderInput()}
          {/* <Input
            type="text"
            className="border border-border outline-none"
            value={filter.value}
            onChange={(e) => updateFilterValue(filter.key, e.target.value)}
          /> */}
        </div>
        <div className="pl-1">
          <button
            className="w-8 h-8 border border-transparent rounded-full hover:bg-neutral-100 active:bg-neutral-200"
            onClick={() => removeFilter(filter.key)}
          >
            <svg
              className="h-6 ml-1 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 12 12"
            >
              <path
                fill="currentColor"
                d="M5 3h2a1 1 0 0 0-2 0M4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zM5 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M3.38 9.085a1 1 0 0 0 .997.915h3.246a1 1 0 0 0 .996-.915L9.055 4h-6.11z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
