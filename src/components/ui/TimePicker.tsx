import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type Props = {
  value?: any;
  onChange?: any;
  disabled?: boolean;
};

const TimePicker = ({ value, onChange, disabled }: Props) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-full px-4 py-2 border border-border-input rounded-md text-[13px] text-left"
            disabled={disabled}
          >
            {value}
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-0">
          <Flatpickr
            value={value}
            onChange={onChange}
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: "h:i",
              inline: true,
              defaultDate: value,
            }}
            className="w-full px-4 py-2 border border-border-input rounded-md text-sm focus:ring focus:ring-blue-500 hidden"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimePicker;
