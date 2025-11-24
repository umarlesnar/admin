"use client";

import { PolicyIcon } from "@/components/ui/icons/PolicyIcon";
import { UsersIcon } from "@/components/ui/icons/UsersIcon";
import Text from "@/components/ui/text";
import React from "react";

interface PolicysideNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const sidebarNavigation = [
  { name: "Policy", key: "policy", icon: PolicyIcon },
  { name: "Attach", key: "attach", icon: UsersIcon },
];

const PolicysideNavBar: React.FC<PolicysideNavBarProps> = ({ activeTab, setActiveTab }) => (
  <div className="w-[255px] bg-white rounded-xl h-full space-y-2 pt-4 px-2 pb-2">
    {sidebarNavigation.map(({ name, key, icon: Icon }) => (
      <button
        key={key}
        onClick={() => setActiveTab(key)}
        className={`flex items-center gap-[10px] px-4 py-2 rounded-md cursor-pointer w-full text-left 
          ${activeTab === key ? "bg-primary-100" : "hover:bg-primary-100"}`}
      >
        <Icon className="h-5 w-5 text-icon-primary" aria-hidden="true" />
        <Text tag="span" size="sm" weight="medium">
          {name}
        </Text>
      </button>
    ))}
  </div>
);

export default PolicysideNavBar;
