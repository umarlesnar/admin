import { FlowStartIcon } from "@/components/ui/icons/FlowStartIcon";
import Text from "@/components/ui/text";
import React from "react";

type Props = {};

const StartNodeLabel = (props: Props) => {
  return (
    <div className="min-w-fit h-7 pl-2 pr-5 rounded-l-full bg-primary-600 text-white absolute top-0 -left-[93px] flex items-center gap-[3px] -z-10">
      <FlowStartIcon className="w-[15px] h-[15px]" />
      <Text size="xs" className="text-[9px]" color="white">
        Flow Start
      </Text>
    </div>
  );
};

export default StartNodeLabel;
