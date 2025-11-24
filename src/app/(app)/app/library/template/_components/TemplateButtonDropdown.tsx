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
import React, { useMemo, useState } from "react";

type Props = {
  buttons: any;
  onSelectData?: any;
};

const buttonOptions = [
  {
    label: "Quick reply buttons",
    buttons: [
      {
        name: "Custom button",
        value: {
          type: "QUICK_REPLY",
          text: "",
        },
        disable: false,
      },
    ],
  },
  {
    label: "Call-to-Actions buttons",
    buttons: [
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
    ],
  },
];

const TemplateButtonDropdown = ({ buttons, onSelectData }: Props) => {
  const [open, setOpen] = useState(false);

  const _options = useMemo(() => {
    const typeCounts = buttons.reduce((acc: any, item: any) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    const updatedProvider = buttonOptions.map((category) => {
      const updatedButtons = category.buttons.map((button) => {
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

      return { ...category, buttons: updatedButtons };
    });

    return updatedProvider;
  }, [buttons]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button rightIcon={<PlusIcon className="w-4 h-4 ml-2" />}>
          Add Button
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] rounded-md p-1">
        <Command>
          <CommandList>
            {_options?.map((option: any, index: number) => {
              return (
                <CommandGroup
                  heading={option?.label}
                  key={index}
                  className="p-1"
                >
                  {option.buttons.map((button: any, idx: number) => (
                    <CommandItem
                      key={idx}
                      onSelect={() => {
                        if (typeof onSelectData == "function") {
                          onSelectData(button?.value);
                        }
                        setOpen(false);
                      }}
                      className="gap-2 cursor-pointer"
                      disabled={button.disable}
                    >
                      <div className="space-y-1">
                        <Text>{button.name}</Text>
                        <Text size="xs" color="secondary">
                          {button.discription}
                        </Text>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TemplateButtonDropdown;
