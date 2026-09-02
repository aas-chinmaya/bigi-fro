import React from "react";
import { Input } from "./input";

export interface DateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        className={className}
        {...props}
      />
    );
  },
);

DateInput.displayName = "DateInput";

export { DateInput };
