import { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import { QuicKReplyIcon } from "@/components/ui/icons/QuickReplyIcon";
import { Link2Icon } from "@/components/ui/icons/Link2Icon";
import { PhoneIcon } from "@/components/ui/icons/PhoneIcon";
import { FlowIcon } from "@/components/ui/icons/FlowIcon";
import { OfferIcon } from "@/components/ui/icons/OfferIcon";
import { OrderStatusIcon } from "@/components/ui/icons/OrderStatusIcon";
import { DownIcon } from "@/components/ui/icons/DownIcon";

type Props = {
  buttons: any;
  onSelectData?: (data: any) => void;
};

const buttonOptions = [
  {
    label: "Quick reply buttons",
    // icons: <QuicKReplyIcon className="w-[18px] h-[18px] text-[#3C524E]" />,
    buttons: [
      {
        name: "Custom button",
        icon: <QuicKReplyIcon className="w-[16px] h-[16px] text-[#3C524E]" />,
        value: { type: "QUICK_REPLY", text: "" },
        disable: false,
      },
    ],
  },
  {
    label: "Call-to-Actions buttons",
    // icons: <Campaign3Icon className="w-[18px] h-[18px]" />,
    buttons: [
      {
        name: "Call Phone Number",
        icon: <PhoneIcon className="w-[18px] h-[18px] text-[#3C524E]" />,
        value: {
          type: "PHONE_NUMBER",
          text: "Call Phone Number",
          phone_number: "",
        },
        description: "1 button maximum",
        disable: false,
      },
      {
        name: "Visit Website",
        icon: <Link2Icon className="text-[#3C524E] w-[18px] h-[18px]" />,
        value: {
          type: "URL",
          text: "Visit Website",
          url: "",
          url_type: "STATIC",
        },
        description: "2 buttons maximum",
        disable: false,
      },

      {
        name: "Copy Offer Code",
        icon: <OfferIcon className="text-[#3C524E] w-[18px] h-[18px]" />,
        value: { type: "COPY_CODE", text: "Copy Offer Code", example: "" },
        description: "1 button maximum",
        disable: false,
      },
      {
        name: "Flow",
        icon: <FlowIcon className="w-[18px] h-[18px] text-[#3C524E]" />,
        value: {
          type: "FLOW",
          text: "Complete Flow",
          flow_action: "NAVIGATE",
          navigate_screen: "WELCOME_SCREEN",
          flow_id: "",
        },
        description: "1 button maximum",
        disable: false,
      },
      {
        name: "Order Details",
        icon: <OrderStatusIcon className="w-[18px] h-[18px] text-[#3C524E]" />,
        value: { type: "ORDER_DETAILS", text: "Review and Pay" },
        description: "1 button maximum",
        disable: false,
      },
    ],
  },
];

const TemplateButtonDropdown = ({ buttons, onSelectData }: Props) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [flowExist, setFlowExist] = useState(false);

  const handleSelect = (button: any) => {
    if (onSelectData) {
      onSelectData(button.value);
    }
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        } else if (type === "FLOW" && buttons.length > 0) {
          disable = true;
        } else if (type === "ORDER_DETAILS" && buttons.length > 0) {
          disable = true;
        }

        return { ...button, disable };
      });

      return { ...category, buttons: updatedButtons };
    });

    setFlowExist(
      buttons.some((o: any) => {
        return o.type == "FLOW" || o.type == "ORDER_DETAILS";
      })
    );

    return updatedProvider;
  }, [buttons]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={flowExist}
        className="w-40"
      >
        Add Button <DownIcon className="w-4 h-4 ml-2 mt-1" />
      </Button>
      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-60 bg-white shadow-lg rounded-md border z-10  max-h-72 overflow-y-auto">
          {_options.map((option, index) => (
            <div key={index} className="mb-2">
              <div className="flex gap-1 items-center bg-neutral-20/80 py-1.5 px-2.5">
                {/* <span>{option?.icons}</span> */}
                <Text weight="semibold" className="text-gray-600 px-2 py-1">
                  {option.label}
                </Text>
              </div>
              {option.buttons.map((button: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(button)}
                  className={`flex items-center gap-3 p-2 px-3 rounded-md cursor-pointer ${
                    button.disable
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {button.icon}

                  <div>
                    <Text>{button.name}</Text>
                    <Text size="xs" color="secondary">
                      {button.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateButtonDropdown;
