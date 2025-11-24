"use client";
import * as React from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserAvatar from "@/components/ui/UserAvatar";
import { BotIcon } from "@/components/ui/icons/BotIcon";
import Text from "@/components/ui/text";
import { DownIcon } from "@/components/ui/icons/DownIcon";
import { DotIcon } from "@/components/ui/icons/DotIcon";

export function OperatorDropdown({
  options,
  selectedOption,
  onSelectData,
  buttonClassName,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<any>();

  React.useEffect(() => {
    if (selectedOption) {
      setValue(selectedOption);
    }
  }, [selectedOption]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={`w-[250px] item-center h-10 flex bg-secondary px-3 rounded-md ${buttonClassName}`}
        >
          <div className="flex-1 flex items-center gap-2 h-full truncate">
            <UserAvatar size="sm">
              {!value ? (
                "A"
              ) : value?.is_bot ? (
                <BotIcon className="w-3 h-3" />
              ) : (
                <Text size="sm" weight="semibold" color="white">
                  {value?.name?.slice(0, 1).toUpperCase()}
                </Text>
              )}
            </UserAvatar>
            <Text className="truncate pr-1">{value?.name || "Assign to"}</Text>
          </div>
          <div className="h-full flex items-center justify-center">
            <DownIcon className="h-5 w-5 shrink-0 opacity-50 mt-[2px]" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] rounded-md p-1">
        <Command>
          <CommandList>
            {options
              ?.filter((option: any) => option.is_bot)
              .map((option: any) => (
                <CommandItem
                  key={option._id}
                  value={option._id}
                  onSelect={() => {
                    if (typeof onSelectData == "function") {
                      onSelectData(option);
                    }
                    setValue(option);
                    setOpen(false);
                  }}
                  className={`gap-2 cursor-pointer px-3 rounded-md ${
                    value?._id === option._id
                      ? "bg-primary-100 text-primary-500"
                      : ""
                  }`}
                >
                  <UserAvatar
                    className={`${
                      value?._id === option._id
                        ? "bg-primary-700 text-white"
                        : "bg-primary-200 text-primary-900"
                    }`}
                    size="sm"
                  >
                    <BotIcon className="w-3 h-3" />
                  </UserAvatar>
                  <Text
                    color={value?._id === option._id ? "primary" : "secondary"}
                    className="flex-1"
                  >
                    {option.name}
                  </Text>
                  <DotIcon
                    className={`w-2 h-2 ${
                      option?.is_online ? "text-green-500" : "text-red-500"
                    }`}
                  />
                </CommandItem>
              ))}
            <CommandGroup heading={"Teams"}>
              {options
                ?.filter((option: any) => !option.is_bot)
                .map((option: any) => (
                  <CommandItem
                    key={option._id}
                    value={option._id}
                    onSelect={() => {
                      if (typeof onSelectData == "function") {
                        onSelectData(option);
                      }
                      setValue(option);
                      setOpen(false);
                    }}
                    className={`gap-2 cursor-pointer px-3 rounded-md ${
                      value?._id === option._id
                        ? "bg-primary-100 text-primary-500"
                        : ""
                    }`}
                  >
                    <UserAvatar
                      className={`${
                        value?._id === option._id
                          ? "bg-primary-700 text-white"
                          : "bg-primary-200 text-primary-900"
                      }`}
                      size="sm"
                    >
                      {option.name?.slice(0, 1).toUpperCase()}
                    </UserAvatar>
                    <Text
                      color={
                        value?._id === option._id ? "primary" : "secondary"
                      }
                      className="flex-1"
                    >
                      {option.name}
                    </Text>
                    <DotIcon
                      className={`w-2 h-2 ${
                        option?.is_online ? "text-green-500" : "text-red-500"
                      }`}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
