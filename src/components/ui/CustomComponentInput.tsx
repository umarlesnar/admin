import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftComponent?: React.ReactElement;
  rightComponent?: React.ReactElement;
  inputClassName?: string;
}

const CustomComponentInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, leftComponent, rightComponent, inputClassName, ...props },
    ref
  ) => {
    return (
      <div>
        <div
          className={cn(
            `flex  items-center justify-start h-9 group w-auto rounded-md border border-border-teritary bg-background gap-[4px] focus-within:outline-none focus-within:ring-2 disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-primary `,
            className
          )}
        >
          {leftComponent}
          <input
            type="text"
            className={cn(
              "appearance-none block w-full text-sm font-normal text-gray-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-teritary outline-none pr-2",
              inputClassName
            )}
            ref={ref}
            {...props}
          />
          {rightComponent}
        </div>
      </div>
    );
  }
);
CustomComponentInput.displayName = "CustomComponentInput";

export { CustomComponentInput };
