"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { useApplication } from "@/contexts/application/application.context";
import Text from "@/components/ui/text";
import WhatsappProfileForm from "./WhatsappProfileForm";
import CatalogSetup from "./CatalogSetup";
import CatalogDetails from "./CatalogDetails";

type Props = {};

const WhatsappInfoSideTab = (props: Props) => {
  const { business } = useApplication();

  return (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="py-6 px-2 h-[85vh] "
    >
      <Text tag={"h1"} size="2xl" weight="medium" className="">
        Whatsapp Info
      </Text>
      <div className="w-full flex h-full gap-3 space-y-0 py-4 px-1">
        <TabsList className="w-[225px] p-2 flex flex-col items-start justify-start h-full border border-border-teritary rounded-md bg-white space-y-2">
          <TabsTrigger
            value="profile"
            className="w-full h-10 text-text-primary font-medium data-[state=active]:text-text-primary data-[state=active]:bg-primary-100 flex flex-row justify-start"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="catalog"
            className="w-full h-10 text-text-primary font-medium data-[state=active]:text-text-primary data-[state=active]:bg-primary-100 flex flex-row justify-start"
          >
            Catalog
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="w-full h-auto overflow-hidden">
          <div className="w-full h-full overflow-y-auto bg-scroll">
            <WhatsappProfileForm />
          </div>
        </TabsContent>

        <TabsContent
          value="catalog"
          className="w-[75%] flex-1 flex flex-col overflow-y-auto bg-scroll"
        >
          {business?.catalog_settings?.catalog_id ? (
            <CatalogDetails />
          ) : (
            <CatalogSetup />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default WhatsappInfoSideTab;
