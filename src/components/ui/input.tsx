import * as React from "react";

import { cn } from "@/lib/utils";
import Text from "./text";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassname?: string;
  isRequired?: boolean;
  errorKey?: any;
  limit?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      isRequired = false,
      labelClassname,
      type,
      errorKey,
      limit,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-[3px]">
        {isRequired || label ? (
          <div>
            {label && (
              <label
                className={`text-sm font-semibold text-text-primary ${labelClassname}`}
              >
                {label}
              </label>
            )}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </div>
        ) : null}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2  disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-primary",
            className
          )}
          ref={ref}
          {...props}
        />

        {errorKey || limit ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              {errorKey && (
                <Text size="xs" textColor="text-red-500" className="pt-1">
                  {errorKey}
                </Text>
              )}
            </div>
            {limit && (
              <Text size="xs" color="secondary" className="pt-1">
                {/* @ts-ignore */}
                {`${props?.value?.length}/${limit}`}
              </Text>
            )}
          </div>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
