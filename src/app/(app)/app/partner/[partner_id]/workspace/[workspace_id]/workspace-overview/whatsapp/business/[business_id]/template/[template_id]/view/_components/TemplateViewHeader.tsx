"use client";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import Text from "@/components/ui/text";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const TemplateViewHeader = (props: Props) => {
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

        <Text size="lg" weight="semibold" color="primary">
          View Template
        </Text>
      </div>
    </div>
  );
};

export default TemplateViewHeader;
