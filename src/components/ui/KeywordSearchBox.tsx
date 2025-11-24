import * as React from "react";
import { cn } from "@/lib/utils";
import { TagIcon } from "./icons/TagIcon";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const KeywordSearchBox = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-start h-10 group w-auto rounded-full border border-border-teritary bg-background px-3 py-2 gap-[5px] focus-within:outline-none focus-within:ring-2 disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-primary ">
          <span>
            <TagIcon className="h-4 cursor-pointer text-icon" />
          </span>
          <input
            type="text"
            className={cn(
              "appearance-none px-1 block w-full text-sm font-normal text-gray-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-teritary outline-none",
              className
            )}
            placeholder="Enter Keyword"
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
KeywordSearchBox.displayName = "KeywordSearchBox";

export { KeywordSearchBox };
