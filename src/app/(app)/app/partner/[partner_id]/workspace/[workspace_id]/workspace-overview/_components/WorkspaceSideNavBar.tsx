"use client";
import { AgentsIcon } from "@/components/ui/icons/AgentsIcon";
import { BellIcon } from "@/components/ui/icons/BellIcon";
import { ChatBotIcon } from "@/components/ui/icons/ChatBotIcon";
import { DownIcon } from "@/components/ui/icons/DownIcon";
import { InstaIcon } from "@/components/ui/icons/InstaIcon";
import { IntegrationIcon } from "@/components/ui/icons/IntegrationIcon";
import { InvoiceIcon } from "@/components/ui/icons/InvoiceIcon";
import { MessengerIcon } from "@/components/ui/icons/MessengerIcon";
import { ModulesIcon } from "@/components/ui/icons/ModulesIcon";
import { OverviewIcon2 } from "@/components/ui/icons/OverviewIcon2";
import { Setting2Icon } from "@/components/ui/icons/Setting2Icon";
import { SubscriptionIcon } from "@/components/ui/icons/SubscriptionIcon";
import { WalletIcon } from "@/components/ui/icons/WalletIcon";
import { WebhookIcon } from "@/components/ui/icons/WebhookIcon";
import { WhatsappIcon } from "@/components/ui/icons/WhatsappIcon";
import Text from "@/components/ui/text";
import { useApplication } from "@/contexts/application/application.context";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

type Props = {};

const WorkspaceSideNavBar = (props: Props) => {
  const path = usePathname();
  const { business } = useApplication();
  const params = useParams();

  const sidebarNavigation = [
    {
      name: "Overview",
      href: `/app/partner/${params.partner_id}/workspace/${params?.workspace_id}/workspace-overview`,
      icon: OverviewIcon2,
    },
  ];

  const whatsappNavigation = [
    {
      name: "Whatsapp",
      href: `/app/partner/${params.partner_id}/workspace/${params?.workspace_id}/workspace-overview/whatsapp`,
      icon: WhatsappIcon,
    },
    {
      name: "Instagram",
      href: `/app/partner/${params.partner_id}/workspace/${params?.workspace_id}/workspace-overview/instagram`,
      icon: InstaIcon,
    },
    {
      name: "Messenger",
      href: `/app/partner/${params.partner_id}/workspace/${params?.workspace_id}/workspace-overview/messenger`,
      icon: MessengerIcon,
    },
    {
      name: "Chat Bot",
      href: `/app/partner/${params.partner_id}/workspace/${params?.workspace_id}/workspace-overview/chat-bot`,
      icon: ChatBotIcon,
    },
  ];
  const bottomNavigation = [
    {
      name: "Manage Users",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/manage-users`,
      icon: AgentsIcon,
    },
    {
      name: "Invoice",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/invoice`,
      icon: InvoiceIcon,
    },
    {
      name: "Subscription",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/subscription`,
      icon: SubscriptionIcon,
    },
    {
      name: "Modules",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/modules`,
      icon: ModulesIcon,
    },
    {
      name: "Wallet",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/wallet`,
      icon: WalletIcon,
    },
    {
      name: "Webhooks",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/webhook`,
      icon: WebhookIcon,
    },
    {
      name: "Notifications",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/notifications`,
      icon: BellIcon,
    },
  ];
  const intergrationNavigation = [
    {
      name: "Installations",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/integrations`,
      icon: IntegrationIcon,
    },
    
  ];
  const settingNavigation = [
    {
      name: "Settings",
      href: `/app/partner/${params.partner_id}/workspace/${params.workspace_id}/workspace-overview/setting`,
      icon: Setting2Icon,
    },
    
  ];

  return (
    <div className="w-[255px] rounded-xl h-full space-y-2 pt-4 px-2 pb-2 overflow-auto">
      {sidebarNavigation.map((item, index) => {
        const isActive = item.href == path;
        return (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center justify-between group pl-2 pr-1 py-2 rounded-md cursor-pointer ${
              isActive ? "bg-primary-500 text-white" : "text-icon-primary"
            } hover:bg-primary-500 hover:text-white`}
          >
            <div className="flex gap-2 items-center group-hover:text-white">
              <item.icon
                className={` h-6 w-6 group-hover:text-white ${
                  isActive ? "text-white" : "text-icon-primary"
                }`}
                aria-hidden="true"
              />
              <Text
                tag="span"
                size="base"
                weight="regular"
                className={isActive ? "text-white" : "group-hover:text-white"}
              >
                {item?.name}
              </Text>
            </div>
            <div>
              <DownIcon className="-rotate-90" />
            </div>
          </Link>
        );
      })}
      <div>
        <div className="pb-4">
          <Text weight="medium" size="sm" className="text-[#2f2b3d80]">
            CHANNELS
          </Text>
        </div>
        <div className="space-y-2">
          {whatsappNavigation.map((item, index) => {
            const isActive = item.href == path;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center justify-between group px-4 py-2 rounded-md cursor-pointer ${
                  isActive ? "bg-primary-500 text-white" : "text-icon-primary"
                } hover:bg-primary-500 hover:text-white`}
              >
                <div className="flex gap-2 items-center group-hover:text-white">
                  <item.icon
                    className={` h-6 w-6 group-hover:text-white ${
                      isActive ? "text-white" : "text-icon-primary"
                    }`}
                    aria-hidden="true"
                  />
                  <Text
                    tag="span"
                    size="base"
                    weight="regular"
                    className={
                      isActive ? "text-white" : "group-hover:text-white"
                    }
                  >
                    {item?.name}
                  </Text>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <div className="pb-4 ">
          <Text weight="medium" size="sm" className="text-[#2f2b3d80]">
            GENERAL
          </Text>
        </div>
        <div className="space-y-2">
          {bottomNavigation.map((item, index) => {
            const isActive = item.href == path;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center justify-between group px-4 py-2 rounded-md cursor-pointer ${
                  isActive ? "bg-primary-500 text-white" : "text-icon-primary"
                } hover:bg-primary-500 hover:text-white`}
              >
                <div className="flex gap-2 items-center group-hover:text-white">
                  <item.icon
                    className={` h-6 w-6 group-hover:text-white ${
                      isActive ? "text-white" : "text-icon-primary"
                    }`}
                    aria-hidden="true"
                  />
                  <Text
                    tag="span"
                    size="base"
                    weight="regular"
                    className={
                      isActive ? "text-white" : "group-hover:text-white"
                    }
                  >
                    {item?.name}
                  </Text>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <div className="pb-4 ">
          <Text weight="medium" size="sm" className="text-[#2f2b3d80]">
            INTERGRATIONS
          </Text>
        </div>
        <div className="space-y-2">
          {intergrationNavigation.map((item, index) => {
            const isActive = item.href == path;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center justify-between group px-4 py-2 rounded-md cursor-pointer ${
                  isActive ? "bg-primary-500 text-white" : "text-icon-primary"
                } hover:bg-primary-500 hover:text-white`}
              >
                <div className="flex gap-2 items-center group-hover:text-white">
                  <item.icon
                    className={` h-5 w-5 group-hover:text-white ${
                      isActive ? "text-white" : "text-icon-primary"
                    }`}
                    aria-hidden="true"
                  />
                  <Text
                    tag="span"
                    size="base"
                    weight="regular"
                    className={
                      isActive ? "text-white" : "group-hover:text-white"
                    }
                  >
                    {item?.name}
                  </Text>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <div className="pb-4 ">
          <Text weight="medium" size="sm" className="text-[#2f2b3d80]">
            SETTINGS
          </Text>
        </div>
        <div className="space-y-2">
          {settingNavigation.map((item, index) => {
            const isActive = item.href == path;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center justify-between group px-4 py-2 rounded-md cursor-pointer ${
                  isActive ? "bg-primary-500 text-white" : "text-icon-primary"
                } hover:bg-primary-500 hover:text-white`}
              >
                <div className="flex gap-2 items-center group-hover:text-white">
                  <item.icon
                    className={` h-5 w-5 group-hover:text-white ${
                      isActive ? "text-white" : "text-icon-primary"
                    }`}
                    aria-hidden="true"
                  />
                  <Text
                    tag="span"
                    size="base"
                    weight="regular"
                    className={
                      isActive ? "text-white" : "group-hover:text-white"
                    }
                  >
                    {item?.name}
                  </Text>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSideNavBar;
