import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Text from "@/components/ui/text";
import { variableOptions } from "@/lib/utils/common";

const VariantButtonDropdown = ({ onSelect, options = [] }: any) => {
  const [open, setOpen] = useState(false);
  const [variables, setVariables] = useState(variableOptions);

  useEffect(() => {
    if (options.length > 0) {
      setVariables(options);
    }
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          <PlusIcon className="w-2.5 h-2.5" />
          <span className="text-xs font-medium">Add Variable</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 rounded-md p-1">
        <Command>
          <CommandList>
            {variables.map((group, index) => (
              <CommandGroup heading={group.label} key={index} className="p-1">
                {group.variables.map((variable, idx) => (
                  <CommandItem
                    key={idx}
                    onSelect={() => {
                      if (typeof onSelect === "function") {
                        onSelect(variable.value);
                      }
                      setOpen(false);
                    }}
                    className="gap-2 cursor-pointer"
                  >
                    <Text>{variable.name}</Text>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VariantButtonDropdown;
