import { useState, useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import { AuthendicationIcon } from "@/components/ui/icons/AuthendicationIcon";
import { MarketingIcon } from "@/components/ui/icons/MarketingIcon";
import { UtilityIcon } from "@/components/ui/icons/UtilityIcon";
import Text from "@/components/ui/text";
import { ChevronDown } from "lucide-react";

const initialComponentValue = [
  {
    type: "HEADER",
    format: "NONE",
    text: "",
  },
  {
    type: "BODY",
    text: "",
  },
  {
    type: "FOOTER",
    text: "",
  },
  {
    type: "BUTTONS",
    buttons: [],
  },
];

const CATEGORY = [
  {
    value: "MARKETING",
    name: "Marketing Template",
    description: "Send promotions to increase awareness and engagement.",
    icon: <MarketingIcon className="w-4 h-4 text-gray-600" />,
    subcategories: [
      {
        name: "Custom",
        description: "Send promotions to increase awareness and engagement.",
      },
      {
        name: "Carousel",
        description: "Share multiple media cards in a swipeable format.",
      },
      // {
      //   name: "Limited time offer",
      //   description: "Send promotions to increase awareness and engagement.",
      // },
    ],
  },
  {
    value: "UTILITY",
    name: "Utility Template",
    icon: <UtilityIcon className="w-4 h-4 text-gray-600" />,
    subcategories: [
      {
        name: "Custom",
        description: "Send messages about an existing order or account.",
      },
      {
        name: "Order Status",
        description: "Inform customers about the progress to their orders",
      },
    ],
  },
  {
    value: "AUTHENTICATION",
    name: "Authentication Template",
    icon: <AuthendicationIcon className="w-4 h-4 text-gray-600" />,
    subcategories: [
      {
        name: "One-time Passcode",
        description: "Send codes to verify a transaction or login.",
      },
    ],
  },
];

const TemplateCatagoryTabs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { values, setFieldValue }: any = useFormikContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryChange = (category: any) => {
    setFieldValue("category", category.value);

    if (category.value === "AUTHENTICATION") {
      setFieldValue("components", initialComponentValue);
      setFieldValue(
        `components.${1}.text`,
        "{{OTP_NUMBER}} is your verification code. For your security, do not share this code."
      );
      setFieldValue(`components.${1}.example.body_text`, [""]);
      setFieldValue(`components.${1}.add_security_recommendation`, true);
      setFieldValue(`components.${2}.code_expiration_minutes`, 10);
      setFieldValue(`components.${2}.text`, "This code expires in 10 minutes.");
      setFieldValue(`components.${3}.buttons`, [
        { type: "OTP", otp_type: "COPY_CODE" },
      ]);
    } else {
      // If switching from AUTHENTICATION, reset all components including BODY
      if (values.category === "AUTHENTICATION") {
        setFieldValue("components", initialComponentValue);
      } else {
        // Otherwise, preserve BODY and reset other components
        const currentBody = values.components?.find(
          (comp: any) => comp.type === "BODY"
        );
        const resetComponents = initialComponentValue.map((comp) =>
          comp.type === "BODY" && currentBody ? currentBody : comp
        );
        setFieldValue("components", resetComponents);
      }
    }

    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        className="w-full border rounded-md px-3 py-[7px] flex justify-between items-center bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus:outline-none border-border-input"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {values.category
            ? CATEGORY.find((c) => c.value === values.category)?.name
            : "Choose Category"}
        </span>
        <span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg">
          {CATEGORY.map((category, index) => (
            <div key={index} className="border-b last:border-none">
              {/* Category Header */}
              <div className="flex items-center gap-2 p-2 px-2.5 bg-neutral-20">
                {category.icon}
                <Text weight="semibold" size="base" textColor="text-gray-600">
                  {category.name}
                </Text>
              </div>
              {/* Subcategories */}
              {category.subcategories.map((sub, subIndex) => (
                <div
                  key={subIndex}
                  className={`pl-3 pr-2 pt-2 pb-3 cursor-pointer space-y-1 hover:bg-gray-100 rounded-md ${
                    subIndex !== category.subcategories.length - 1
                      ? "border-b"
                      : ""
                  }`}
                  onClick={() => {
                    handleCategoryChange(category);
                    setIsOpen(false);

                    if (sub.name == "Carousel") {
                      setFieldValue("components", [
                        {
                          type: "BODY",
                          text: "",
                        },
                        { type: "carousel", cards: [] },
                      ]);
                    }
                  }}
                >
                  <Text weight="regular" size="sm">
                    {sub.name}
                  </Text>
                  <Text size="xs" color="secondary">
                    {sub.description}
                  </Text>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateCatagoryTabs;
