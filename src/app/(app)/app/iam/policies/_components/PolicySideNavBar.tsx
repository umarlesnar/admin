"use client";
import { PolicyIcon } from "@/components/ui/icons/PolicyIcon";
import { UsersIcon } from "@/components/ui/icons/UsersIcon";
import Text from "@/components/ui/text";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const sidebarNavigation = [
  {
    name: "Policy",
    href: "/app/iam/policies",
    icon: PolicyIcon,
  },
  {
    name: "Attach",
    href: "/app/iam/users",
    icon: UsersIcon,
  },
];

const PolicySideNavBar = (props: Props) => {
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

export default PolicySideNavBar;

