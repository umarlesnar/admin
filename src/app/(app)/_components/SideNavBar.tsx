"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { KwicIcon } from "@/components/ui/icons/KwicIcon";
import CustomTooltip from "@/components/ui/CustomTooltip";
// import { AutomationIcon } from "@/components/ui/icons/AutomationIcon";
import { TemplateIcon } from "@/components/ui/icons/TemplateIcon";
import { IntegrationIcon } from "@/components/ui/icons/IntegrationIcon";
import { WalletIcon } from "@/components/ui/icons/WalletIcon";
import { SettingsIcon } from "@/components/ui/icons/SettingsIcon";
import { ProfilePopup } from "./ProfilePopup";
import { KwicFullIcon } from "@/components/ui/icons/KwicFullIcon";
import { BriefcaseBusiness, HomeIcon } from "lucide-react";
import { UserIcon } from "@/components/ui/icons/userIcon";
import { WebhookIcon } from "@/components/ui/icons/WebhookIcon";
import { AccessIcon } from "@/components/ui/icons/AccessIcon";
import { ProductIcon } from "@/components/ui/icons/ProductIcon";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { PartnerIcon } from "@/components/ui/icons/PartnerIcon";
import { BillIcon } from "@/components/ui/icons/BillIcon";
import { NotesIcon } from "@/components/ui/icons/NotesIcon";
import { ModulesIcon } from "@/components/ui/icons/ModulesIcon";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {};

const sidebarNavigation = [
  {
    name: "Dashboard",
    href: "/app/dashboard",
    basePath: "/app/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Library",
    href: "/app/library/template",
    basePath: "/app/library/template",
    icon: TemplateIcon,
  },
  {
    name: "Modules",
    href: "/app/modules",
    basePath: "/app/modules",
    icon: ModulesIcon,
  },
  // {
  //   name: "Bot Flow Library",
  //   href: "/app/library/bot-flow-library",
  //   basePath: "/app/library/bot-flow-library",
  //   icon: AutomationIcon,
  // },
  {
    name: "Integrations",
    href: "/app/integrations",
    basePath: "/app/integrations",
    icon: IntegrationIcon,
  },
  {
    name: "Access Management",
    href: "/app/iam/policies",
    basePath: "/app/iam/policies",
    icon: AccessIcon,
  },
  // {
  //   name: "Business",
  //   href: "/app/business",
  //   basePath: "/app/business",
  //   icon: BriefcaseBusiness,
  // },
  {
    name: "Onboarding User",
    href: "/app/user-account",
    basePath: "/app/user-account",
    icon: UserIcon,
  },
  {
    name: "Webhooks",
    href: "/app/webhook",
    basePath: "/app/webhook",
    icon: WebhookIcon,
  },
  // {
  //   name: "Plans",
  //   href: "/app/products",
  //   basePath: "/app/products",
  //   icon: ProductIcon,
  // },
  {
    name: "Notification",
    href: "/app/alert-message",
    basePath: "/app/alert-message",
    icon: AlertIcon,
  },
  // {
  //   name: "Billing",
  //   href: "/app/billing/subscription",
  //   basePath: "/app/billing/subscription",
  //   icon: NotesIcon,
  // },
  // {
  //   name: "Workspace",
  //   href: "/app/workspace",
  //   basePath: "/app/workspace",
  //   icon: BriefcaseBusiness,
  // },
  {
    name: "Partner",
    href: "/app/partner",
    basePath: "/app/partner",
    icon: PartnerIcon,
  },
];

const bottomNavigation: any = [
  // {
  //   name: "Wallet",
  //   href: "/app/settings/wallet",
  //   basePath: "/app/settings/wallet",
  //   icon: WalletIcon,
  // },
  // {
  //   name: "Settings",
  //   href: "/app/settings/google",
  //   basePath: "/app/settings/google",
  //   icon: SettingsIcon,
  // },
];

const SideNavBar = (props: Props) => {
  const path = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      aria-label="Sidebar"
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Old SideNavBar */}
      <div className="hidden w-[60px] h-full md:flex-shrink-0 md:bg-white md:overflow-y-auto md:flex md:flex-col justify-between">
        <div className="relative w-full flex flex-col items-center p-2 space-y-1">
          <Link href={"/app"}>
            <div className="h-10 w-10 flex items-center justify-center mb-6 cursor-pointer">
              <KwicIcon className="w-8 h-8" />
            </div>
          </Link>

          {sidebarNavigation.map((item) => (
            <CustomTooltip
              value={item.name}
              key={item.name}
              side="right"
              sideOffset={6}
            >
              <Link
                href={item.href}
                className={classNames(
                  path.startsWith(item.basePath)
                    ? "bg-[#2F2B3D14] "
                    : "text-icon-primary hover:bg-[#2F2B3D14]",
                  "flex-shrink-0 inline-flex items-center justify-center h-[36px] w-[36px] rounded-lg"
                )}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </CustomTooltip>
          ))}
        </div>

        <div className="relative w-full flex flex-col items-center p-2 space-y-1">
          {bottomNavigation.map((item: any) => (
            <CustomTooltip
              value={item.name}
              key={item.name}
              side="right"
              sideOffset={6}
            >
              <Link
                href={item.href}
                className={classNames(
                  item.href == path
                    ? "bg-[#2F2B3D14] "
                    : "text-icon-primary hover:bg-[#2F2B3D14]",
                  "flex-shrink-0 inline-flex items-center justify-center h-[36px] w-[36px] rounded-lg"
                )}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </CustomTooltip>
          ))}

          <ProfilePopup />
        </div>
      </div>

      {/* New SideNavBar */}
      <div
        className={classNames(
          "absolute top-0 h-full z-30 bg-white shadow-lg flex flex-col justify-between items-start ",
          isHovered ? "w-[250px]" : "w-0",
          "overflow-hidden transition-all duration-200"
        )}
      >
        <div className="relative w-full flex flex-col items-start p-2 pl-3 space-y-1">
          <Link href={"/app"}>
            <div className="w-[108px] h-[48px] flex items-center justify-start mb-5 ml-0.5 cursor-pointer">
              {/* <KwicFullIcon className="w-[108px] h-[48px]" /> */}
              <KwicFullIcon className="w-[92px] h-[42px] -mt-1.5" />
            </div>
          </Link>

          {sidebarNavigation.map((item) => (
            <Link
              href={item.href}
              key={item.name}
              className={classNames(
                path.startsWith(item.basePath)
                  ? "bg-[#2F2B3D14] "
                  : "text-icon-primary hover:bg-[#2F2B3D14]",
                "flex items-center space-x-3 p-2 w-full rounded-md"
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="relative w-full flex flex-col items-start p-2 -mb-2">
          {bottomNavigation.map((item: any, index: number) => (
            <Link
              href={item.href}
              key={item.name}
              className={classNames(
                path.startsWith(item.basePath)
                  ? "bg-[#2F2B3D14] "
                  : "text-icon-primary hover:bg-[#2F2B3D14]",
                `flex items-center space-x-3 p-2 ${
                  index == 1 ? "-mb-1" : "mb-1"
                } pl-3 w-full rounded-md`
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
          <div className="py-2 pl-2">
            <ProfilePopup show={isHovered} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideNavBar;
