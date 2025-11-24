"use client";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PolicyViewSheet from "./PolicyViewForm";
import BusinessPoliciesList from "./BusinessPolicyList";

type Props = {};


const PolicyViewHeader = (props: Props) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("policy");

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <ArrowIcon
          className="w-5 cursor-pointer text-icon-primary mt-2"
          onClick={() => router?.back()}
        />
        <Tabs
          className="w-full h-full"
          defaultValue="policy"
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
        >
          <TabsList className="w-52 flex space-x-2 bg-gray-100 p-1.5 rounded-full">
            <TabsTrigger
              value="policy"
              className="flex items-center justify-center px-4 py-2 font-semibold text-neutral-600 rounded-full data-[state=active]:text-primary-700"
            >
              Policy
            </TabsTrigger>
            <TabsTrigger
              value="business_policy"
              className="flex items-center justify-center px-4 py-2 font-semibold text-neutral-600 rounded-full data-[state=active]:text-primary-700"
            >
             Attach Policy
            </TabsTrigger>
          </TabsList>
          <TabsContent className="flex w-full h-full" value="policy">
            <PolicyViewSheet />
          </TabsContent>
          <TabsContent className="flex w-full h-[90vh] bg-white rounded-md p-4" value="business_policy">
           <BusinessPoliciesList/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PolicyViewHeader;
