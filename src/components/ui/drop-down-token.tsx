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
import { SearchBox } from "./SearchBox";

export default function DropdownTokenFilter({
  children,
  options,
  onSelectData,
  selectedOptions,
  headerComponent,
  dropdownClassname,
}: any) {
  const [selectedFilters, setSelectedFilters] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setSelectedFilters(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    setFilteredOptions(
      options?.filter((option: any) =>
        option?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleFilterChange = useCallback((value: any) => {
    setSelectedFilters((prev: any) => {
      let newArr = [...prev];
      if (newArr.includes(value)) {
        newArr = newArr.filter((item) => item !== value);
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
      <DropdownMenuContent align="start" className="w-[448px]">
        {headerComponent}
        <DropdownMenuSeparator />
        <div className="p-2">
          <SearchBox
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup
          className={`max-h-72 overflow-y-auto bg-scroll ${dropdownClassname}`}
        >
          {filteredOptions?.length === 0 ? (
            <DropdownMenuItem className="py-3">
              <Text
                className="w-full text-center"
                weight="semibold"
                color="secondary"
              >
                No matching events found
              </Text>
            </DropdownMenuItem>
          ) : (
            filteredOptions?.map((option: any, index: number) => (
              <DropdownMenuItem
                key={index}
                onSelect={(event) => {
                  event.preventDefault();
                  handleFilterChange(option.value);
                }}
                className="cursor-pointer w-full"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedFilters.includes(option.value)}
                  />
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {option.name}
                  </label>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
