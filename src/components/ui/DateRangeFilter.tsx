"use client";

import * as React from "react";
import { format, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import { DropdownIcon } from "@/components/ui/icons/DropdownIcon";
import { CalendarIcon } from "lucide-react";

export default function DateRangeFilter({
  dateRange,
  setDateRange,
  presetLabel,
  setPresetLabel,
  onPresetChange,
}: any) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const presets = [
    {
      label: "Today",
      range: {
        from: new Date(new Date().setHours(0, 1, 0, 0)),
        to: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
    {
      label: "Yesterday",
      range: {
        from: new Date(subDays(new Date(), 1).setHours(0, 1, 0, 0)),
        to: new Date(subDays(new Date(), 1).setHours(23, 59, 59, 999)),
      },
    },
    {
      label: "Past 7 days",
      range: { from: subDays(new Date(), 7), to: new Date() },
    },
    {
      label: "Past 15 days",
      range: { from: subDays(new Date(), 15), to: new Date() },
    },
    {
      label: "Past 30 days",
      range: { from: subDays(new Date(), 30), to: new Date() },
    },
    {
      label: "Past 90 days",
      range: { from: subDays(new Date(), 90), to: new Date() },
    },
  ];

  return (
    <div>
      {presetLabel && (
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-fit border-border-secondary rounded-md"
              >
                <span className="mr-2">
                  <CalendarIcon className="w-5 h-5 text-icon-primary" />
                </span>
                {presetLabel == "Custom Range" ? (
                  <div className="text-sm font-medium">
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange?.from, "dd MMM YYY")} - ${format(
                          dateRange?.to,
                          "dd MMM YYY"
                        )}`
                      : ""}
                  </div>
                ) : (
                  presetLabel
                )}
                <span className="ml-5">
                  <DropdownIcon className="text-text-primary w-4 h-4" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[164px] mt-1 rounded-xl border-border-teritary">
              {/* Preset Ranges */}
              {presets.map((preset) => (
                <DropdownMenuItem
                  key={preset.label}
                  onClick={() => {
                    setDateRange(preset.range);
                    setPresetLabel(preset.label);
                    onPresetChange?.(preset.label);
                  }}
                >
                  {preset.label}
                </DropdownMenuItem>
              ))}

              <Popover open={popoverOpen} onOpenChange={() => {}}>
                <PopoverTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setPopoverOpen(true);
                    }}
                  >
                    Custom Range
                  </DropdownMenuItem>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0  mt-2 rounded-md bg-white shadow-md">
                  <Calendar
                    mode="range"
                    selected={dateRange as DateRange}
                    onSelect={(range) => {
                      setDateRange(
                        (range as DateRange) || {
                          from: undefined,
                          to: undefined,
                        }
                      );
                      setPresetLabel("Custom Range");
                    }}
                    numberOfMonths={2}
                    className="rounded-md"
                    disabled={(date) =>
                      date < subDays(new Date(), 90) || date > new Date()
                    }
                  />
                  <div className="pl-2 pr-4 pb-4 mt-2 flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDateRange({ from: undefined, to: undefined });
                        setPopoverOpen(false);
                      }}
                      className="text-green-600"
                    >
                      Clear All
                    </Button>
                    <div>
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => setPopoverOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setPopoverOpen(false);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Display selected range */}
        </div>
      )}
    </div>
  );
}
