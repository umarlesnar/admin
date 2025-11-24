"use client";
import { CategoryIcon } from "@/components/ui/icons/CategoryIcon";
import { IntegrationIcon } from "@/components/ui/icons/IntegrationIcon";
import Text from "@/components/ui/text";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const sidebarNavigation = [
  {
    name: "Integration",
    href: "/app/integrations",
    icon: IntegrationIcon,
  },
  {
    name: "Category",
    href: "/app/integrations/category",
    icon: CategoryIcon,
  },
  {
    name: "Addon",
    href: "/app/integrations/addon",
    icon: IntegrationIcon,
  },
];

const IntegrationSideNavBar = (props: Props) => {
  const path = usePathname();

  return (
    <div className="w-[255px] bg-white rounded-xl h-full space-y-2 pt-4 px-2 pb-2">
      {sidebarNavigation.map((item, index) => {
        return (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-[10px] px-4 py-2 hover:bg-primary-100 rounded-md cursor-pointer ${
              item.href == path ? "bg-primary-100" : ""
            }`}
          >
            <item.icon
              className={` h-5 w-5 text-icon-primary`}
              aria-hidden="true"
            />
            <Text tag="span" size="sm" weight="medium">
              {item?.name}
            </Text>
          </Link>
        );
      })}
    </div>
  );
};

export default IntegrationSideNavBar;
