"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface DropdownProps {
  buttonClassname?: string;
  dropdownClassname?: string;
  options: Array<{ name: string; value: any }>;
  onSelectData?: (item: any) => void;
  selectedOption?: { name: string; value: any };
  children: React.ReactNode;
  align?: "center" | "start" | "end";
}

export function Dropdown({
  buttonClassname = "",
  dropdownClassname = "",
  options,
  onSelectData,
  selectedOption,
  children,
  align = "center",
}: DropdownProps) {
  const [selected, setSelected] = React.useState(selectedOption || null);

  React.useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`justify-between text-sm font-medium text-gray-500 outline-none focus-visible:outline-none ${buttonClassname}`}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={dropdownClassname} align={align}>
        {options?.map((item, index) => (
          <DropdownMenuItem
            textValue={item.name}
            key={index}
            className={`cursor-pointer ${
              item.name == selected?.name ? "bg-neutral-30" : ""
            }`}
            onSelect={() => {
              setSelected(item);
              onSelectData?.(item);
            }}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
