import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBox } from "./SearchBox";

export function Listbox({
  buttonClassname,
  dropdownClassname,
  options,
  onSelectData,
  selectedOption,
  placeholder = "Select Options",
}: any) {
  const [selected, setSelected] = React.useState(
    selectedOption ? selectedOption : ""
  );

  React.useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  return (
    <Select
      //@ts-ignore
      defaultValue={selected?.name}
      value={selected.name}
      onValueChange={(value: any) => {
        const final = options.find((o: any) => {
          return o.name == value;
        });

        if (typeof onSelectData == "function") {
          onSelectData(final);
        }

        setSelected(final);
      }}
    >
      <SelectTrigger
        className={`w-[150px] h-9 justify-between test-sm font-medium text-gray-500 focus:ring-0 ${buttonClassname}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={`p-0 ${dropdownClassname}`}>
        <SelectGroup>
          {options &&
            options.map((item: any, index: number) => {
              return (
                <SelectItem
                  value={item.name}
                  key={index}
                  className="cursor-pointer"
                >
                  {item.name}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
