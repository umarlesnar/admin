"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "./Checkbox";
import Text from "./text";

export default function DropdownTagFilter({
  children,
  options,
  onSelectData,
  selectedOptions,
  headerComponent,
  dropdownClassname,
}: any) {
  const [selectedFilters, setSelectedFilters] = useState<any>([]);

  useEffect(() => {
    setSelectedFilters(selectedOptions);
  }, [selectedOptions]);

  const handleFilterChange = useCallback((value: any) => {
    setSelectedFilters((prev: any) => {
      let newArr = [...prev];
      if (newArr.includes(value)) {
        newArr = newArr.filter((item) => {
          return item !== value;
        });
      } else {
        newArr = [...newArr, value];
      }

      if (typeof onSelectData == "function") {
        onSelectData(newArr);
      }

      return newArr;
    });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="outline-none focus-visible:outline-none"
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={`${dropdownClassname}`}>
        {headerComponent}
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="min-w-40 max-w-full max-h-72 overflow-y-auto bg-scroll">
          {options.length == 0 ? (
            <DropdownMenuItem className="py-3">
              <Text
                className="w-full text-center"
                weight="semibold"
                color="secondary"
              >
                Tags Not Found
              </Text>
            </DropdownMenuItem>
          ) : (
            <>
              {" "}
              {options.map((option: any, index: number) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={(event) => {
                    event.preventDefault();
                    handleFilterChange(option.value);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={selectedFilters?.includes(option.value)}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                      {option.name}
                    </label>
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
