import moment from "moment-timezone";
import React, { useState } from "react";
import { Listbox } from "./listbox";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";

const timeFrame = [
  { id: "1", name: "Today" },
  { id: "2", name: "Yesterday" },
  { id: "3", name: "This Week" },
  { id: "4", name: "Last Week" },
  { id: "5", name: "This Month" },
  { id: "6", name: "Last Month" },
  { id: "7", name: "Last Quater" },
  { id: "8", name: "This Year" },
  { id: "9", name: "Last Year" },
];

function getFinancialYearsWithTimestamps() {
  const currentMonth = moment().month(); // Get current month (0-11)
  const currentYear = moment().year(); // Get current year

  // Determine the starting financial year based on the current month (April is the start of FY)
  const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;

  const financialYears = [];

  // Generate the last 4 financial years with start and end timestamps
  for (let i = 0; i < 4; i++) {
    const fyStart = startYear - i;
    const fyEnd = fyStart + 1;

    const startOfFinancialYear = moment(`${fyStart}-04-01`).startOf("day");
    const endOfFinancialYear = moment(`${fyEnd}-03-31`).endOf("day");

    financialYears.push({
      id: i + 2, // id starts from 2 since 1 is reserved for "This Year"
      name: `FY${fyStart % 100}-${fyEnd % 100}`, // Format as FY24-25
      start: startOfFinancialYear.unix(), // Start of financial year in Unix timestamp
      end: endOfFinancialYear.unix(), // End of financial year in Unix timestamp
    });
  }

  return financialYears;
}

const DateFilter = ({ onDateobjChange, placeholder = "This Month" }: any) => {
  const [showDateRangePicker, setShowDateRangePicker] = useState(true);
  const [customDateRange, setCustomDateRange] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [filter, setFilter] = useState(placeholder);
  const [date, setDate] = React.useState<any>();

  const updatedItem = [...timeFrame];

  return (
    <div>
      {showDateRangePicker ? (
        <Listbox
          options={updatedItem}
          placeholder={customDateRange ? customDateRange : "Select Date"}
          selectedOption={updatedItem.find((o) => {
            if (o.name == "Custom") {
              return null;
            } else {
              return o.name == filter;
            }
          })}
          buttonClass="w-[300px] border border-neutral-50 text-sm text-black font-normal py-[10px] bg-white text-gray-800"
          dropDownClass=" w-full z-10 shadow-md top-11"
          onSelectData={(data: any) => {
            setFilter(data?.name);
            if (data?.name === "Today") {
              const startDate = moment().startOf("day").unix();
              const endDate = moment().endOf("day").unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else if (data?.name === "Yesterday") {
              const startDate = moment()
                .subtract(1, "days")
                .startOf("day")
                .unix();
              const endDate = moment().subtract(1, "days").endOf("day").unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else if (data?.name === "This Week") {
              const startDate = moment().startOf("week").unix();
              const endDate = moment().endOf("week").unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else if (data?.name === "Last Week") {
              const startDate = moment()
                .subtract(1, "week")
                .startOf("week")
                .unix();
              const endDate = moment().subtract(1, "week").endOf("week").unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else if (data?.name === "This Month") {
              const startDate = moment().startOf("month").unix();
              const endDate = moment().endOf("month").unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else if (data?.name === "Last Month") {
              const startDate = moment()
                .subtract(1, "month")
                .startOf("month")
                .unix();
              const endDate = moment()
                .subtract(1, "month")
                .endOf("month")
                .unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else if (data?.name === "Last Quater") {
              const startDate = moment().startOf("quarter").unix();
              const endDate = moment().endOf("quarter").unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else if (data?.name === "This Year") {
              const startDate = moment().startOf("year").unix();
              const endDate = moment().endOf("year").unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else if (data?.name === "Last Year") {
              const startDate = moment()
                .subtract(1, "year")
                .startOf("year")
                .unix();
              const endDate = moment().subtract(1, "year").endOf("year").unix();
              onDateobjChange &&
                onDateobjChange({
                  start: startDate,
                  end: endDate,
                });
            } else {
              onDateobjChange &&
                onDateobjChange({
                  start: data?.start,
                  end: data?.end,
                });
            }
          }}
        />
      ) : (
        <div>
          <Popover
            open={isPopoverOpen}
            onOpenChange={(value) => {
              setIsPopoverOpen(value);
              if (!value) {
                setShowDateRangePicker(true);
                setIsPopoverOpen(false);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {date ? (
                  <span>
                    {moment(date.from).format("ll")}{" "}
                    <span>
                      {date.to ? `-` + `${moment(date.to).format("ll")}` : null}
                    </span>
                  </span>
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(value: any) => {
                  const fromTimestamp = moment(
                    value?.from,
                    "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
                  ).unix();
                  const toTimestamp = moment(
                    value?.to,
                    "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
                  )
                    .endOf("day")
                    .unix();

                  if (value?.from && value?.to) {
                    if (typeof onDateobjChange == "function") {
                      onDateobjChange({
                        start: fromTimestamp,
                        end: toTimestamp,
                      });
                    }

                    setShowDateRangePicker(true);
                    setIsPopoverOpen(false);
                  }

                  setCustomDateRange(
                    `${moment(value?.from).format("ll")}${
                      value.to ? `-` + `${moment(value.to).format("ll")}` : null
                    }`
                  );

                  setDate(value);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
