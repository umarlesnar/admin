import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";
import { Button } from "./button"; // Import your Button component

type Props = {
  value?: any;
  onChange?: any;
  disabled?: boolean;
};

const TimePicker = ({ value, onChange, disabled }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-xs mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-full px-4 py-2 border border-border-input rounded-md text-[13px] text-left disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
            type="button" // Ensure it doesn't submit forms
          >
            {value || "Select Time"}
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-auto">
          <div className="flex flex-col">
            <Flatpickr
              value={value}
              onChange={onChange}
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i", // Changed to 24h format 'H:i' or keep 'h:i' as preferred
                time_24hr: true,   // Enable 24h selection if needed
                inline: true,
                defaultDate: value,
              }}
              className="hidden" // Flatpickr handles its own UI in inline mode
            />
            <div className="p-2 border-t bg-gray-50 flex justify-end">
              <Button 
                size="sm" 
                className="h-7 text-xs" 
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimePicker;