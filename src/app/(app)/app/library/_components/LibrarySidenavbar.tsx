"use client";
import { AutomationIcon } from "@/components/ui/icons/AutomationIcon";
import { BotFlowIcon } from "@/components/ui/icons/BotFlowIcon";
import { IndustryIcons } from "@/components/ui/icons/industry";
import { TemplateIcon } from "@/components/ui/icons/TemplateIcon";
import { WorkflowIcon } from "@/components/ui/icons/WorkflowIcon";
import Text from "@/components/ui/text";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const sidebarNavigation = [
  {
    name: "Template",
    href: "/app/library/template",
    icon: TemplateIcon,
  },
  {
    name: "BotFlow",
    href: "/app/library/bot-flow",
    icon: AutomationIcon,
  },
  {
    name: "WorkFlow",
    href: "/app/library/work-flows",
    icon: WorkflowIcon,
  },
  {
    name: "Industries",
    href: "/app/library/industries",
    icon: IndustryIcons,
  },
];

const LibrarySideNavBar = (props: Props) => {
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
              className={` ${
                index === 1 ? "h-6 w-6" : "h-5 w-5"
              } text-icon-primary`}
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

export default LibrarySideNavBar;
