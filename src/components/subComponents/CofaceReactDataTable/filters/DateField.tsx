import { useCallback, ChangeEvent, JSX } from "react";
import { Input } from "../../../../shadcn-ui/components/ui/input";
import * as React from "react";

type Value = string;

export type Props = {
  /** Basic hint for a user */
  placeholder?: string;
  /** Input value as Date.toISOString() output */
  value?: Value;
  /** Capture value changes */
  onChange: (value: Value) => void;
  /** Icon name to show on the left side of the input */
};

export const DateField = ({
  placeholder,
  value,
  onChange,
}: Props): JSX.Element => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const dateString = event.target.valueAsDate ? event.target.value : "";
      onChange(dateString);
    },
    [onChange]
  );
  // const value = valueProp
  //   ? new Date(valueProp).toISOString().split("/").reverse().join("-")
  //   : "";
  return (
    <Input
      type="date"
      className="block border border-border outline-none font-semibold"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
};
