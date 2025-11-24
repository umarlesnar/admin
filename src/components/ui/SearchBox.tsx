import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  searchBoxClassName?: string;
}

const SearchBox = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, searchBoxClassName, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <div
          className={cn(
            "flex items-center justify-start h-9 group w-auto rounded-md border border-border-teritary bg-background px-3 py-2 gap-[5px] focus-within:outline-none focus-within:ring-2 disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-primary",
            searchBoxClassName
          )}
        >
          <span>
            <SearchIcon className="h-4 cursor-pointer text-icon" />
          </span>
          <input
            type="text"
            className={cn(
              "appearance-none block w-full text-sm font-normal text-gray-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-teritary outline-none",
              className
            )}
            placeholder="Search"
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);

SearchBox.displayName = "SearchBox";

export { SearchBox };
