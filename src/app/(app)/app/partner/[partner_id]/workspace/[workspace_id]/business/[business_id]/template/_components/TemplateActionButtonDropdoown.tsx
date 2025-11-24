"use client";
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Text from "@/components/ui/text";
import { useFormikContext } from "formik";

const actionButtons = [
  {
    name: "Call Phone Number",
    value: {
      type: "PHONE_NUMBER",
      text: "Call Phone Number",
      phone_number: "",
    },
    discription: "1 buttons maximum",
    disable: false,
  },
  {
    name: "Visit Website",
    value: {
      type: "URL",
      text: "Visit Website",
      url: "",
      url_type: "STATIC",
    },
    discription: "2 buttons maximum",
    disable: false,
  },
  {
    name: "Copy Offer Code",
    value: {
      type: "COPY_CODE",
      text: "Copy Offer Code",
      example: "",
    },
    discription: "1 buttons maximum",
    disable: false,
  },
];

export function TemplateActionButtonDropdoown({
  buttonClassname,
  dropdownClassname,
  selectedOption,
  onSelectData,
  placeholder = "Select Option",
  align = "center",
}: any) {
  const [buttons, setButtons] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<any>({});
  const { values }: any = useFormikContext();

  React.useEffect(() => {
    setButtons(values?.components[3]?.buttons);
  }, [values?.components[3]?.buttons]);

  React.useEffect(() => {
    if (selectedOption) {
      setValue(
        actionButtons.find((o) => {
          return o.value.type == selectedOption.type;
        })
      );
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

  const _options = React.useMemo(() => {
    const typeCounts = buttons.reduce((acc: any, item: any) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    const updatedButtons = actionButtons.map((button) => {
      const type = button.value.type;

      let disable = false;
      if (type === "PHONE_NUMBER" && typeCounts[type] >= 1) {
        disable = true;
      } else if (type === "URL" && typeCounts[type] >= 2) {
        disable = true;
      } else if (type === "COPY_CODE" && typeCounts[type] >= 1) {
        disable = true;
      }

      return { ...button, disable };
    });

    return updatedButtons;
  }, [buttons]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={` justify-between h-10 text-text-primary ${buttonClassname} truncate`}
        >
          <Text className="w-[80%] truncate">{value?.name || placeholder}</Text>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={` p-0`}
        align={align}
        style={{ width: triggerWidth }}
      >
        <Command
          className={`w-full p-0 overflow-y-auto bg-scroll z-50 ${dropdownClassname}`}
        >
          <CommandList className="w-full overflow-y-auto bg-scroll">
            <CommandGroup className="w-full">
              {_options.map((option: any, index: number) => (
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
                  disabled={option.disable}
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
