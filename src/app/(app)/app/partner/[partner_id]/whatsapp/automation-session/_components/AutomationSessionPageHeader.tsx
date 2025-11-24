// src/app/(app)/app/partner/[partner_id]/whatsapp/automation-session/_components/AutomationSessionPageHeader.tsx
"use client";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import Text from "@/components/ui/text";
import { useRouter } from "next/navigation";
import React from "react";

const AutomationSessionPageHeader = () => {
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <ArrowIcon
          className="w-5 cursor-pointer text-icon-primary"
          onClick={() => {
            router?.back();
          }}
        />
        <Text size="2xl" weight="medium" color="primary">
          Automation Session
        </Text>
      </div>
    </div>
  );
};

export default AutomationSessionPageHeader;
