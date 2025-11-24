"use client";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import Text from "@/components/ui/text";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const UserPageHeader = (props: Props) => {
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
          Users
        </Text>
      </div>
    </div>
  );
};

export default UserPageHeader;
