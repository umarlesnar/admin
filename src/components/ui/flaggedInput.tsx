import * as React from "react";
import { cn } from "@/lib/utils";
import Text from "./text";
import { InputProps } from "./input";

// Indian Flag SVG Icon Component
const IndianFlag = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      viewBox="0 0 48 48"
      fill="none"
    >
      <rect width="48" height="48" fill="#FF9933" />
      <rect y="16" width="48" height="16" fill="#FFFFFF" />
      <rect y="32" width="48" height="16" fill="#138808" />
      <circle cx="24" cy="24" r="5" fill="#000080" />
    </svg>
  );
};

// Custom Flagged Input Field Component with Dropdown for Country Code
export interface FlaggedInputProps extends InputProps {
  countryCode?: string;
  onCountryCodeChange?: (value: string) => void; // Handler for dropdown change
}

const FlaggedInput = React.forwardRef<HTMLInputElement, FlaggedInputProps>(
  (
    {
      className,
      label,
      isRequired = false,
      labelClassname,
      type,
      errorKey,
      countryCode = "+91", // Default to Indian country code
      onCountryCodeChange,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <div className="flex items-center">
            <label
              className={`text-sm font-semibold text-text-primary px-1 ${labelClassname}`}
            >
              {label}
            </label>
            {isRequired && <span className="text-red-500">*</span>}
          </div>
        )}
        <div className="relative flex items-center">
          {/* Country Code Dropdown */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <select
              value={countryCode}
              onChange={(e) => onCountryCodeChange?.(e.target.value)}
              className="bg-transparent border-none outline-none pr-2 text-sm"
            >
              <option value="+91">+91</option>
              {/* Add more country codes here */}
            </select>
          </div>


          {/* Input field with padding adjusted to leave space for the dropdown */}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-border-input bg-background pl-20 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-primary",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {/* Error message */}
        {errorKey && (
          <Text size="xs" textColor="text-red-500" className="pt-1">
            {errorKey}
          </Text>
        )}
      </div>
    );
  }
);

FlaggedInput.displayName = "FlaggedInput";

export { FlaggedInput };
