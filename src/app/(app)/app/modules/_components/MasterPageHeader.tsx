import Text from "@/components/ui/text";
import React from "react";

type Props = {};

const MasterPageHeader = (props: Props) => {
  return (
    <div className="w-full flex flex-wrap">
      <div className=" w-full mr-auto pr-3 align-middle">
        <div className="w-full text-nowrap flex items-center justify-between">
          <Text tag={"h1"} size={"xl"} weight="bold">
            Modules
          </Text>
        </div>
      </div>
    </div>
  );
};

export default MasterPageHeader;
