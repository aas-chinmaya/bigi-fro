// import * as React from "react";
// import { cn } from "./utils";

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> { }

// export const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, ...props }, ref) => (
//     <input
//       ref={ref}
//       className={cn(
//         "w-full rounded-lg border border-gray-300 px-4 py-2 outline-none",
//         "focus:border-primary focus:ring-1 focus:ring-primary/30",
//         className
//       )}
//       {...props}
//     />
//   )
// );

// Input.displayName = "Input";


import * as React from "react";
import { cn } from "./utils";

// FIX: Changed ':' back to 'extends' to fix the ts(2365) error
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        // Layout & Styling
        "w-full rounded-lg border border-gray-300 px-4 py-2 outline-none",
        "focus:border-primary focus:ring-1 focus:ring-primary/30",
        
        // Hide Up/Down arrows for Chrome, Safari, Edge, and Opera
        "[&::-webkit-outer-spin-button]:appearance-none",
        "[&::-webkit-inner-spin-button]:appearance-none",
        
        // Hide Up/Down arrows for Firefox
        "[appearance:textfield]",
        
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
