"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AgentsIcon } from "@/components/ui/icons/AgentsIcon";
import { Currency2Icon } from "@/components/ui/icons/Currency2Icon";
import { DownIcon } from "@/components/ui/icons/DownIcon";
import { IntegrationIcon } from "@/components/ui/icons/IntegrationIcon";
import { OverviewIcon2 } from "@/components/ui/icons/OverviewIcon2";
import { RoundIcon } from "@/components/ui/icons/RoundIcon";
import { Setting2Icon } from "@/components/ui/icons/Setting2Icon";
import { TemplateIcon2 } from "@/components/ui/icons/TemplateIcon2";
import { UsersIcon } from "@/components/ui/icons/UsersIcon";
import Text from "@/components/ui/text";
import { useApplication } from "@/contexts/application/application.context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const BusinessViewSideNavBar = (props: Props) => {
  const path = usePathname();
  const { business } = useApplication();

  const [selectedBusinessId, setSelectedBusinessId] = useState(business?._id);

  useEffect(() => {
    if (business?._id) {
      setSelectedBusinessId(business._id);
    }
  }, [business]);

  const sidebarNavigation = [
    {
      name: "Overview",
      href: `/app/business/${selectedBusinessId}/overview`,
      icon: OverviewIcon2,
    },
  ];

  const whatsappNavigation = [
    {
      name: "Account",
      href: `/app/business/${selectedBusinessId}/whatsapp-account`,
      icon: RoundIcon,
    },
    {
      name: "Whatsapp Info",
      href: `/app/business/${selectedBusinessId}/whatsapp-info`,
      icon: RoundIcon,
    },
    {
      name: "Webhook Subscription",
      href: `/app/business/${selectedBusinessId}/webhook-subscription`,
      icon: RoundIcon,
    },
  ];
  const bottomNavigation = [
    {
      name: "Agents",
      href: `/app/business/${selectedBusinessId}/agents`,
      icon: AgentsIcon,
    },

    {
      name: "Template",
      href: `/app/business/${selectedBusinessId}/template`,
      icon: TemplateIcon2,
    },
    {
      name: "Payments",
      href: `/app/business/${selectedBusinessId}/payments`,
      icon: Currency2Icon,
    },
    {
      name: "Settings",
      href: `/app/business/${selectedBusinessId}/settings`,
      icon: Setting2Icon,
    },
  ];
  const intergrationNavigation = [
    {
      name: "Installation Apps",
      href: `/app/business/${selectedBusinessId}/integration`,
      icon: IntegrationIcon,
    }
  ]
  // const settingsNavigation = [
  //   {
  //     name: "Cloud Provider",
  //     href: `/app/business/${selectedBusinessId}/cloud-provider`,
  //     icon: RoundIcon,
  //   },
  // ];

  return (
    <div className="w-[255px] rounded-xl h-full space-y-2 pt-4 px-2 pb-2">
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
      <div className="py-4 ">
        <Text weight="medium" size="sm" className="text-[#2f2b3d80] ">
          ACCOUNTS
        </Text>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-2 py-2 hover:no-underline">
            <div className="flex gap-3">
              <UsersIcon /> <span className="text-icon-primary">Whatsapp</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pt-1 ">
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
      {/* <Accordion
        type="single"
        collapsible
        className="w-full pt-4"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className=" py-2 hover:no-underline">
            <div className="flex gap-3">
              <Setting2Icon />{" "}
              <span className="text-icon-primary">Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pt-1 ">
            {settingsNavigation.map((item, index) => {
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
      </Accordion> */}
    </div>
  );
};

export default BusinessViewSideNavBar;
