import React, { useState } from "react";
import "flatpickr/dist/themes/material_green.css";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { Calendar } from "./calendar";

type Props = {
  label?: string;
  lablebg?: string;
  selected?: Date | number | null | undefined; // relaxed type to handle Date or timestamps
  isRequired?: boolean;
  placeholder?: string;
  className?: string;
  labelClassname?: string;
  mode?: "single" | "range" | "multiple"; // refined type
  onSelected?: (date: any) => void; // relaxed to accept the date from calendar
  disabled?: boolean;
  minDate?: Date; // Added minDate to Props
  layout?: "vertical" | "horizontal"; // Added layout prop
};

const DatePicker = ({
  label,
  selected,
  mode = "single",
  placeholder = "Pick a date",
  isRequired,
  labelClassname,
  onSelected,
  disabled = false,
  minDate,
  layout = "vertical", // Default is vertical
}: Props) => {
  const [open, setOpen] = useState(false);

  // Helper to convert any input (Date obj, unix seconds, unix ms) to a valid Date object
  const getDateObject = (value: any): Date | undefined => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    
    if (typeof value === "number") {
      // Heuristic: Timestamps in seconds are usually 10 digits (until year 2286)
      // Timestamps in milliseconds are 13 digits.
      // 100,000,000,000 is roughly year 5138, safe threshold to distinguish sec vs ms
      return value < 100000000000 
        ? moment.unix(value).toDate() 
        : moment(value).toDate();
    }
    
    // Fallback for string dates
    return moment(value).toDate();
  };

  const dateObject = getDateObject(selected);

  // Dynamic classes based on layout
  const containerClasses = layout === "horizontal" 
    ? "flex items-center gap-4 w-full" 
    : "space-y-1 w-full";
    
  const labelClasses = layout === "horizontal"
    ? "min-w-fit text-right"
    : "text-left";

  return (
    <div className={containerClasses}>
      {(label || isRequired) && (
        <div className={labelClasses}>
          {label && (
            <label
              className={cn(
                "text-sm font-semibold text-gray-400 px-1",
                labelClassname
              )}
            >
              {label}
            </label>
          )}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-start h-9 group rounded-md bg-background gap-1 focus-within:outline focus-within:outline-1 focus-within:outline-primary">
        <Popover
          open={!disabled && open}
          onOpenChange={(value) => {
            setOpen(value);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full h-9 justify-start text-left font-normal",
                !dateObject && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateObject ? (
                moment(dateObject).format("DD-MM-YYYY")
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single" // Explicitly set to single to match the selected type expectation
              selected={dateObject} 
              onSelect={(value: any) => {
                if (typeof onSelected == "function") {
                  onSelected(value);
                }
                setOpen(false);
              }}
              // Pass the disabled matcher correctly to react-day-picker
              disabled={minDate ? { before: minDate } : undefined}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePicker;