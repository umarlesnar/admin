"use client";
import { AgentsIcon } from "@/components/ui/icons/AgentsIcon";
import { BotFlowIcons } from "@/components/ui/icons/BotFlowIcons";
import { CampaignIcon } from "@/components/ui/icons/CampaignIcon";
import { TemplateIcon2 } from "@/components/ui/icons/TemplateIcon2";
import { UsersIcon } from "@/components/ui/icons/UsersIcon";
import { WhatsappBrandIcon } from "@/components/ui/icons/WhatappBrandIcon";
import { WorkflowIcon } from "@/components/ui/icons/WorkflowIcon";
import Text from "@/components/ui/text";
import { useApplication } from "@/contexts/application/application.context";
import { useBusinessByIdQuery } from "@/framework/business/get-business-by-id";
import { useBroadcastQuery } from "@/framework/business/overview/get-broadcasts";
import { useBusinessTemplateByIdQuery } from "@/framework/business/overview/get-business-template";
import { useContactQuery } from "@/framework/business/overview/get-contacts";
import { useFlowQuery } from "@/framework/business/overview/get-flows";
import { useWorkFlowsQuery } from "@/framework/business/overview/get-work-flows";
import { useBusinessUserByIdQuery } from "@/framework/business/users/get-business-users";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const Overview = () => {
  const params = useParams();
  const { setUserParams } = useApplication();
  const business_id = params?.business_id;

  const { data, isLoading } = useBusinessByIdQuery(business_id);

  useEffect(() => {
    if (data) {
      setUserParams({
        business: data,
      });
    }
  }, [data]);

  const contactData = useContactQuery(business_id);
  const TemplateData = useBusinessTemplateByIdQuery(business_id);
  const AgentData = useBusinessUserByIdQuery(business_id);
  const BroadcastData = useBroadcastQuery(business_id);
  const WorkflowData = useWorkFlowsQuery(business_id);
  const FlowData = useFlowQuery(business_id);

  return (
    <>
      {!isLoading ? (
        <div className=" lg:flex  overflow-hidden gap-4 space-y-4 lg:space-y-0">
          <div className="bg-white rounded-lg p-5 px-6 space-y-4 w-full lg:w-[700px] min-h-[450px]">
            <div className="flex justify-between items-center pb-4">
              <Text tag="span" size="lg" weight="medium" className="text-icon">
                Account
              </Text>
              {data?.status === "ACTIVE" ? (
                <div className="px-3.5 pb-[2px] rounded-sm bg-[#26c76f]">
                  <Text
                    tag="span"
                    size="xs"
                    weight="medium"
                    textColor="text-white"
                    className=" tracking-wider "
                  >
                    {data?.status}
                  </Text>
                </div>
              ) : (
                <div className="px-3.5 pb-[2px] rounded-sm bg-red-500">
                  <Text
                    tag="span"
                    size="xs"
                    weight="medium"
                    textColor="text-white"
                    className=" tracking-wider "
                  >
                    {data?.status}
                  </Text>
                </div>
              )}
            </div>
            <div className="w-full flex gap-4 pb-3 border-b">
              {data?.business_logo_url ? (
                <div className="relative w-14 h-14 rounded-full">
                  <img
                    src={`https://static.kwic.in${data?.business_logo_url}`}
                    alt="nekhop-logo"
                    loading="eager"
                    className="object-cover w-14 h-14 rounded-full"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-primary-500 text-white font-semibold">
                  <span>{data?.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}

              <div className="space-y-1 ">
                <Text tag="span" size="lg" weight="medium">
                  {data?.name}
                </Text>
                <div className="flex gap-1 items-center">
                  <WhatsappBrandIcon className="text-lg" />
                  <Text tag="span" size="base" weight="regular">
                    {data?.wb_status?.phone_number
                      ? data?.wb_status?.phone_number
                      : "-"}
                  </Text>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Text
                tag="p"
                size="base"
                weight="regular"
                textColor="text-icon-primary"
              >
                E-mail:
              </Text>
              <Text
                tag="p"
                size="base"
                weight="regular"
                textColor="text-icon-primary"
              >
                {data?.business_profile?.email
                  ? data?.business_profile?.email
                  : "-"}
              </Text>
            </div>
            <div className="space-y-1">
              <Text
                tag="p"
                size="base"
                weight="regular"
                textColor="text-icon-primary"
              >
                Description:
              </Text>
              <Text
                tag="p"
                size="base"
                weight="regular"
                textColor="text-icon-primary"
              >
                {data?.business_profile?.description
                  ? data?.business_profile?.description
                  : "-"}
              </Text>
            </div>
            <div className="space-y-1">
              <Text
                tag="p"
                size="base"
                weight="regular"
                textColor="text-icon-primary"
              >
                Address:
              </Text>
              <Text
                tag="p"
                size="base"
                weight="regular"
                textColor="text-icon-primary"
              >
                {data?.business_profile?.address
                  ? data?.business_profile?.address
                  : "-"}
              </Text>
            </div>
            <div className="space-y-1">
              <Text
                tag="p"
                size="base"
                weight="regular"
                textColor="text-icon-primary"
              >
                Category:
              </Text>
              <Text
                tag="p"
                size="base"
                weight="regular"
                textColor="text-icon-primary"
              >
                {data?.business_profile?.vertical
                  ? data?.business_profile?.vertical
                      .toLowerCase()
                      .split("_")
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")
                  : "-"}
              </Text>
            </div>
          </div>
          <div className="grid md:grid-cols-2 justify-between w-full gap-x-4 gap-y-4">
            <div className="bg-white rounded-md mx-auto flex items-center w-full lg:max-w-[300px] px-6 py-5">
              <div className="flex justify-between w-full gap-2">
                <div className="space-y-2">
                  <Text
                    tag="p"
                    size="base"
                    weight="medium"
                    textColor="text-icon-primary/70"
                  >
                    Contacts
                  </Text>
                  <div className="flex gap-2 items-center">
                    <Text tag="span" size="2xl" weight="medium">
                      {contactData?.data?.length || 0}
                    </Text>
                    {/* <Text
                      tag="span"
                      size="base"
                      weight="medium"
                      textColor="text-green-500"
                    >
                      (+{((contactData?.data?.length || 0) / 100) * 100}%)
                    </Text> */}
                  </div>
                  <Text tag="p" size="base" weight="regular">
                    Total Contacts
                  </Text>
                </div>
                <div className="w-11 h-11 rounded-md flex items-center justify-center bg-[#e9e7fd]">
                  <UsersIcon className="text-[#7367F0] w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md mx-auto flex items-center w-full  lg:max-w-[300px] px-6 py-5">
              <div className="flex justify-between w-full gap-2">
                <div className="space-y-2">
                  <Text
                    tag="p"
                    size="base"
                    weight="medium"
                    textColor="text-icon-primary/70"
                  >
                    Templates
                  </Text>
                  <div className="flex gap-2 items-center">
                    <Text tag="span" size="2xl" weight="medium">
                      {TemplateData?.data?.total_result || 0}
                    </Text>
                    {/* <Text
                      tag="span"
                      size="base"
                      weight="medium"
                      textColor="text-green-500"
                    >
                      (+{((TemplateData?.data?.total_result || 0) / 100) * 100}
                      %)
                    </Text> */}
                  </div>
                  <Text tag="p" size="base" weight="regular">
                    Total Templates
                  </Text>
                </div>
                <div className="w-11 h-11 rounded-md flex items-center justify-center bg-[#FF9F4329]">
                  <TemplateIcon2 className="text-[#FF9F43] w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md mx-auto flex items-center w-full lg:max-w-[300px] px-6 py-5">
              <div className="flex justify-between w-full gap-2">
                <div className="space-y-2">
                  <Text
                    tag="p"
                    size="base"
                    weight="medium"
                    textColor="text-icon-primary/70"
                  >
                    Agents
                  </Text>
                  <div className="flex gap-2 items-center">
                    <Text tag="span" size="2xl" weight="medium">
                      {AgentData?.data?.total_result || 0}
                    </Text>
                    {/* <Text
                      tag="span"
                      size="base"
                      weight="medium"
                      textColor="text-green-500"
                    >
                      (+{((AgentData?.data?.total_result || 0) / 100) * 100}%)
                    </Text> */}
                  </div>
                  <Text tag="p" size="base" weight="regular">
                    Total Agents
                  </Text>
                </div>
                <div className="w-11 h-11 rounded-md flex items-center justify-center bg-[#00BAD114]">
                  <AgentsIcon className="text-[#00BAD1] w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md mx-auto flex items-center w-full lg:max-w-[300px] px-6 py-5">
              <div className="flex justify-between w-full gap-2">
                <div className="space-y-2">
                  <Text
                    tag="p"
                    size="base"
                    weight="medium"
                    textColor="text-icon-primary/70"
                  >
                    Campaigns
                  </Text>
                  <div className="flex gap-2 items-center">
                    <Text tag="span" size="2xl" weight="medium">
                      {BroadcastData?.data?.data?.length || 0}
                    </Text>
                    {/* <Text
                      tag="span"
                      size="base"
                      weight="medium"
                      textColor="text-green-500"
                    >
                      (+{((BroadcastData?.data?.data?.length || 0) / 100) * 100}
                      %)
                    </Text> */}
                  </div>
                  <Text tag="p" size="base" weight="regular">
                    Total Campaigns
                  </Text>
                </div>
                <div className="w-11 h-11 rounded-md flex items-center justify-center bg-[#FF4C5129]">
                  <CampaignIcon className="text-[#FF4C51] w-6 h-6 -rotate-12" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md mx-auto flex items-center w-full lg:max-w-[300px] px-6 py-5">
              <div className="flex justify-between w-full gap-2">
                <div className="space-y-2">
                  <Text
                    tag="p"
                    size="base"
                    weight="medium"
                    textColor="text-icon-primary/70"
                  >
                    Work Flows
                  </Text>
                  <div className="flex gap-2 items-center">
                    <Text tag="span" size="2xl" weight="medium">
                      {WorkflowData?.data?.length || 0}
                    </Text>
                    {/* <Text
                      tag="span"
                      size="base"
                      weight="medium"
                      textColor="text-green-500"
                    >
                      (+{((WorkflowData?.data?.length || 0) / 100) * 100}%)
                    </Text> */}
                  </div>
                  <Text tag="p" size="base" weight="regular">
                    Total Work Flows
                  </Text>
                </div>
                <div className="w-11 h-11 rounded-md flex items-center justify-center bg-[#28C76F29]">
                  <WorkflowIcon className="text-[#28C76F] w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md mx-auto flex items-center w-full lg:max-w-[300px] px-6 py-5">
              <div className="flex justify-between w-full gap-2">
                <div className="space-y-2">
                  <Text
                    tag="p"
                    size="base"
                    weight="medium"
                    textColor="text-icon-primary/70"
                  >
                    Bot Flows
                  </Text>
                  <div className="flex gap-2 items-center">
                    <Text tag="span" size="2xl" weight="medium">
                      {FlowData?.data?.data?.length || 0}
                    </Text>
                    {/* <Text
                      tag="span"
                      size="base"
                      weight="medium"
                      textColor="text-green-500"
                    >
                      (+{((FlowData?.data?.data?.length || 0) / 100) * 100}%)
                    </Text> */}
                  </div>
                  <Text tag="p" size="base" weight="regular">
                    Total Bot Flows
                  </Text>
                </div>
                <div className="w-11 h-11 rounded-md flex items-center justify-center bg-[#28C76F29]">
                  <BotFlowIcons className="text-[#28C76F] w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[450px] flex gap-8 justify-between p-4 items-center w-full bg-neutral-20 rounded-xl animate-pulse">
          <div className="h-[410px] w-[36%] bg-neutral-40 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-2 gap-6 w-[64%]">
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[300px] h-[120px]"></div>
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[300px] h-[120px]"></div>
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[300px] h-[120px]"></div>
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[300px] h-[120px]"></div>
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[300px] h-[120px]"></div>
            <div className="bg-neutral-40 rounded-xl animate-pulse w-[300px] h-[120px]"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Overview;
