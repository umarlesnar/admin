"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Text from "./text";
import { DownIcon } from "./icons/DownIcon";

export function BusinessComboBox({
  buttonClassname,
  dropdownClassname,
  options,
  selectedOption,
  onSelectData,
  imgUrl,
  img_data,
  business_data,
  placeholder = "Select Option",
  align = "center",
  onSearch,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<any>({});

  React.useEffect(() => {
    if (selectedOption) {
      setValue(selectedOption);
    }
  }, [selectedOption]);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={` justify-between items-center gap-3 text-text-primary ${buttonClassname} truncate`}
          rightIcon={<DownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        >
          {img_data ? (
            <div className="relative w-[25px] h-[25px] rounded-full">
              <img
                src={imgUrl}
                alt="business-logo"
                loading="eager"
                className="object-cover rounded-full w-[25pxx] h-[25px]"
              />
            </div>
          ) : (
            <div className="w-[25px] h-[25px] rounded-full flex items-center justify-center text-xs bg-primary-500 text-white font-semibold">
              <span>{business_data?.charAt(0).toUpperCase()}</span>
            </div>
          )}

          <Text className=" truncate text-start">
            {value?.name || placeholder}
          </Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`p-0`}
        align={align}
        style={{ width: triggerWidth }}
      >
        <Command className={`w-full p-0 bg-scroll ${dropdownClassname}`}>
          <CommandInput
            placeholder="Search here..."
            onValueChange={(value) => onSearch?.(value)}
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option: any, index: number) => (
                <CommandItem
                  className="cursor-pointer"
                  value={option?.name}
                  key={index}
                  onSelect={() => {
                    if (typeof onSelectData == "function") {
                      onSelectData(option);
                    }
                    setValue(option);
                    setOpen(false);
                  }}
                >
                  {option?.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
