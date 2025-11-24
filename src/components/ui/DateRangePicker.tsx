import moment from "moment";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";

const DateRangePicker = ({ onDateRangeChange, selectedRange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(selectedRange);

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Select Date Range";
    if (!range.to) return moment(range.from).format("MMM DD, YYYY");
    return `${moment(range.from).format("MMM DD")} - ${moment(range.to).format("MMM DD, YYYY")}`;
  };

  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    if (selectedRange?.from && selectedRange?.to) {
      onDateRangeChange({
        start: moment(selectedRange.from).startOf("day").toISOString(),
        end: moment(selectedRange.to).endOf("day").toISOString(),
      });
      setIsOpen(false);
    } else if (!selectedRange?.from) {
      onDateRangeChange({ start: "", end: "" });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-40 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="truncate">{formatDateRange(range)}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-3">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
              className="text-sm"
            />
            <div className="flex justify-between mt-3 pt-3 border-t">
              <button
                onClick={() => handleRangeSelect(undefined)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;