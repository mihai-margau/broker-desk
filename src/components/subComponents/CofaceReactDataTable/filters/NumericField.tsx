import { useCallback, ChangeEvent, JSX } from "react";
import { Input } from "../../../../shadcn-ui/components/ui/input";
import * as React from "react";

type Value = string;

export type Props = {
  /** Basic hint for a user */
  placeholder?: string;
  value?: Value;
  /** Capture value changes */
  onChange: (value: Value) => void;
  /** Icon name to show on the left side of the input */
};

export const NumericField = ({
  placeholder,
  value,
  onChange,
}: Props): JSX.Element => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <Input
      type="text"
      pattern="[+\-]?(?:0|[1-9]\d*)(?:\.\d+)?"
      className="border border-border outline-none font-semibold"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
};
