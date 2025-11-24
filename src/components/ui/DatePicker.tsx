import React, { useState } from "react";
import "flatpickr/dist/themes/material_green.css";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { Calendar } from "./calendar";
import { DateRange } from "react-day-picker";

type Props = {
  label?: string;
  lablebg?: string;
  selected?: any;
  isRequired?: boolean;
  placeholder?: string;
  className?: string;
  labelClassname?: string;
  mode?: string;
  onSelected?: any;
  disabled?: boolean;
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
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <div>
        {label && (
          <label
            className={`text-sm font-semibold text-gray-400 px-1 ${labelClassname}`}
          >
            {label}
          </label>
        )}
        {isRequired && <span className="text-red-500 ">*</span>}
      </div>
      <div className=" w-full flex items-center justify-start h-9 group  rounded-md bg-background  gap-1 focus-within:outline focus-within:outline-1 focus-within:outline-primary">
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
                !selected && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selected ? (
                <> {moment.unix(selected).format("DD-MM-YYYY")}</>
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              //@ts-ignore
              mode={mode || "single"}
              //@ts-ignore
              selected={moment.unix(selected).toDate()}
              onSelect={(value: any) => {
                if (typeof onSelected == "function") {
                  onSelected(value);
                }
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePicker;
