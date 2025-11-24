"use client";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RoundIcon } from "@/components/ui/icons/RoundIcon";
import Text from "@/components/ui/text";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { NotesIcon } from "@/components/ui/icons/NotesIcon";
import { SettingsIcon } from "@/components/ui/icons/SettingsIcon";
import { BriefcaseBusiness } from "lucide-react";
import { UsersIcon } from "@/components/ui/icons/UsersIcon";
import { PolicyIcon } from "@/components/ui/icons/PolicyIcon";
import { WhatsappIcon } from "@/components/ui/icons/WhatsappIcon";
import { Instagram1Icon } from "@/components/ui/icons/Instagram1Icon";
import { UserIcon } from "@/components/ui/icons/userIcon";

type Props = {};

const SettingsSideNavBar = (props: Props) => {
  const path = usePathname();
  const params = useParams();

  const workspaceNavigation = [
    {
      name: "Workspace",
      href: `/app/partner/${params.partner_id}/workspace`,
      icon: BriefcaseBusiness,
    },
    {
      name: "Users",
      href: `/app/partner/${params.partner_id}/users`,
      icon: UsersIcon,
    },
    {
      name: "Notifications",
      href: `/app/partner/${params.partner_id}/notifications`,
      icon: AlertIcon,
    },
    {
      name: "Onboarding Workspace",
      href: `/app/partner/${params.partner_id}/workspace/onboard`,
      icon: UserIcon,
    },
    {
      name: "Policies",
      href: `/app/partner/${params.partner_id}/policies`,
      icon: PolicyIcon,
    },
  ];
  const whatsappNavigation = [
    {
      name: "Phone Number",
      href: `/app/partner/${params.partner_id}/whatsapp/phone-number`,
      icon: RoundIcon,
    },
    {
      name: "Template",
      href: `/app/partner/${params.partner_id}/whatsapp/template`,
      icon: RoundIcon,
    },
    {
      name: "Broadcast",
      href: `/app/partner/${params.partner_id}/whatsapp/broadcast`,
      icon: RoundIcon,
    },
    {
      name: "Automation Session",
      href: `/app/partner/${params.partner_id}/whatsapp/automation-session`,
      icon: RoundIcon,
    },
  ];
  const instagramNavigation = [
    {
      name: "Accounts",
      href: `/app/partner/${params.partner_id}/instagram/accounts`,
      icon: RoundIcon,
    },
    {
      name: "Automation",
      href: `/app/partner/${params.partner_id}/instagram/automation`,
      icon: RoundIcon,
    },
    {
      name: "Automation Logs",
      href: `/app/partner/${params.partner_id}/instagram/automation-logs`,
      icon: RoundIcon,
    },
    // {
    //   name: "Access Token",
    //   href: `/app/partner/${params.partner_id}/instagram/access-token`,
    //   icon: RoundIcon,
    // },
  ];

  const sideNavigation = [
    {
      name: "Plan",
      href: `/app/partner/${params.partner_id}/billing/plan`,
      icon: RoundIcon,
    },
    {
      name: "Subscriptions",
      href: `/app/partner/${params.partner_id}/billing/subscriptions`,
      icon: RoundIcon,
    },
    {
      name: "Billing Invoice",
      href: `/app/partner/${params.partner_id}/billing/billing-invoice`,
      icon: RoundIcon,
    },
    {
      name: "Addon",
      href: `/app/partner/${params.partner_id}/billing/addon`,
      icon: RoundIcon,
    },
  ];

  const bottomNavigation = [
    {
      name: "Brand",
      href: `/app/partner/${params.partner_id}/settings/brand`,
      icon: RoundIcon,
    },
    {
      name: "Facebook",
      href: `/app/partner/${params.partner_id}/settings/facebook`,
      icon: RoundIcon,
    },
    {
      name: "Whatsapp",
      href: `/app/partner/${params.partner_id}/settings/whatsapp`,
      icon: RoundIcon,
    },
    {
      name: "Instagram",
      href: `/app/partner/${params.partner_id}/settings/instagram`,
      icon: RoundIcon,
    },
    {
      name: "Kwic",
      href: `/app/partner/${params.partner_id}/settings/kwic`,
      icon: RoundIcon,
    },
    {
      name: "Google",
      href: `/app/partner/${params.partner_id}/settings/google`,
      icon: RoundIcon,
    },
    {
      name: "Razorpay",
      href: `/app/partner/${params.partner_id}/settings/razorpay`,
      icon: RoundIcon,
    },
    {
      name: "Payment",
      href: `/app/partner/${params.partner_id}/settings/payment`,
      icon: RoundIcon,
    },
    // {
    //   name: "System",
    //   href: `/app/partner/${params.partner_id}/settings/system`,
    //   icon: RoundIcon,
    // },
    {
      name: "Websocket Endpoint",
      href: `/app/partner/${params.partner_id}/settings/websocket-endpoint`,
      icon: RoundIcon,
    },
    {
      name: "Pay as you go",
      href: `/app/partner/${params.partner_id}/settings/pay-as-you-go`,
      icon: RoundIcon,
    },

    {
      name: "Email",
      href: `/app/partner/${params.partner_id}/settings/email`,
      icon: RoundIcon,
    },
    // {
    //   name: "Google Sheets",
    //   href: `/app/partner/${params.partner_id}/settings/google-sheets`,
    //   icon: RoundIcon,
    // },
    {
      name: "S3 Storage",
      href: `/app/partner/${params.partner_id}/settings/s3-storage`,
      icon: RoundIcon,
    },
  ];
  const openSection = React.useMemo(() => {
    if (whatsappNavigation.some((item) => item.href === path)) {
      return "whatsapp";
    }
    if (sideNavigation.some((item) => item.href === path)) {
      return "billing";
    }
    if (bottomNavigation.some((item) => item.href === path)) {
      return "settings";
    }
    if (instagramNavigation.some((item) => item.href === path)) {
      return "instagram";
    }
    return null;
  }, [path]);
  return (
    <div className="w-[255px] rounded-xl h-full space-y-2 pt-4 px-2 pb-2 overflow-y-auto">
      <div></div>

      <div className="space-y-2">
        {workspaceNavigation.map((item, index) => {
          const isActive = item.href == path;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center justify-between group px-2 py-2 rounded-md cursor-pointer ${
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
                  className={isActive ? "text-white" : "group-hover:text-white"}
                >
                  {item?.name}
                </Text>
              </div>
            </Link>
          );
        })}
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openSection === "whatsapp" ? "whatsapp" : undefined}
        // defaultValue="item-1"
      >
        <AccordionItem value="whatsapp">
          <AccordionTrigger className="px-2 py-2 hover:no-underline">
            <div className="flex gap-2">
              <WhatsappIcon className="text-icon-primary" />{" "}
              <span className="text-icon-primary"> Whatsapp</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pt-1 ">
            {whatsappNavigation.map((item, index) => {
              const isActive = item.href == path;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between group px-5 py-2 rounded-md cursor-pointer ${
                    isActive ? "bg-primary-500 text-white" : "text-icon-primary"
                  } hover:bg-primary-500 hover:text-white`}
                >
                  <div className="flex gap-2 items-center group-hover:text-white">
                    <item.icon
                      className={` h-3 w-3 group-hover:text-white ${
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openSection === "instagram" ? "instagram" : undefined}
        // defaultValue="item-1"
      >
        <AccordionItem value="instagram">
          <AccordionTrigger className="px-2 py-2 hover:no-underline">
            <div className="flex gap-2">
              <Instagram1Icon className="text-icon-primary" />{" "}
              <span className="text-icon-primary">Instagram</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pt-1 ">
            {instagramNavigation.map((item, index) => {
              const isActive = item.href == path;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between group px-5 py-2 rounded-md cursor-pointer ${
                    isActive ? "bg-primary-500 text-white" : "text-icon-primary"
                  } hover:bg-primary-500 hover:text-white`}
                >
                  <div className="flex gap-2 items-center group-hover:text-white">
                    <item.icon
                      className={` h-3 w-3 group-hover:text-white ${
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openSection === "billing" ? "billing" : undefined}
        // defaultValue="item-1"
      >
        <AccordionItem value="billing">
          <AccordionTrigger className="px-2 py-2 hover:no-underline">
            <div className="flex gap-2">
              <NotesIcon className="text-icon-primary" />{" "}
              <span className="text-icon-primary"> Billing</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pt-1 ">
            {sideNavigation.map((item, index) => {
              const isActive = item.href == path;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between group px-5 py-2 rounded-md cursor-pointer ${
                    isActive ? "bg-primary-500 text-white" : "text-icon-primary"
                  } hover:bg-primary-500 hover:text-white`}
                >
                  <div className="flex gap-2 items-center group-hover:text-white">
                    <item.icon
                      className={` h-3 w-3 group-hover:text-white ${
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <div className="space-y-2">
        {sideNavigation.map((item, index) => {
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
                  className={` h-3 w-3 group-hover:text-white ${
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
            </Link>
          );
        })}
      </div> */}

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openSection === "settings" ? "settings" : undefined}
        // defaultValue="item-1"
      >
        <AccordionItem value="settings">
          <AccordionTrigger className="px-2 py-2 hover:no-underline">
            <div className="flex gap-2">
              <SettingsIcon className="text-icon-primary" />{" "}
              <span className="text-icon-primary"> Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pt-1 ">
            {bottomNavigation.map((item, index) => {
              const isActive = item.href == path;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center justify-between group px-5 py-2 rounded-md cursor-pointer ${
                    isActive ? "bg-primary-500 text-white" : "text-icon-primary"
                  } hover:bg-primary-500 hover:text-white`}
                >
                  <div className="flex gap-2 items-center group-hover:text-white">
                    <item.icon
                      className={` h-3 w-3 group-hover:text-white ${
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <div className="space-y-2">
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
                  className={` h-3 w-3 group-hover:text-white ${
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
            </Link>
          );
        })}
      </div> */}
    </div>
  );
};

export default SettingsSideNavBar;
