"use client";
import { ApiKeyIcon } from "@/components/ui/icons/ApiKeyIcon";
import { PolicyIcon } from "@/components/ui/icons/PolicyIcon";
import { SettingsIcon } from "@/components/ui/icons/SettingsIcon";
import { UserRoleIcon } from "@/components/ui/icons/UserRoleIcon";
import { UsersIcon } from "@/components/ui/icons/UsersIcon";
import Text from "@/components/ui/text";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const sidebarNavigation = [
  {
    name: "Policies",
    href: "/app/iam/policies",
    icon: PolicyIcon,
  },
  {
    name: "Users",
    href: "/app/iam/users",
    icon: UsersIcon,
  },
  {
    name: "System",
    href: "/app/iam/system",
    icon: SettingsIcon,
  },
  {
    name: "User Roles",
    href: "/app/iam/roles",
    icon: UserRoleIcon,
  },
  {
    name: "Api Key Managements",
    href: "/app/iam/api-key-management",
    icon: ApiKeyIcon,
  },
];

const IamSideNavBar = (props: Props) => {
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

export default IamSideNavBar;
