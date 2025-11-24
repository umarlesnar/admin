// import { QuicKReplyIcon } from "@/components/ui/icons/QuickReplyIcon";
import Text from "@/components/ui/text";
import React from "react";

type Props = {
  onClick?: any;
  icon?: React.ReactElement;
  name: string;
};

const FlowItemCard = ({ onClick, icon, name }: Props) => {
  return (
    <div
      className="w-full h-[60px] border border-border-teritary rounded-md flex items-center justify-center gap-[6px] flex-col cursor-pointer"
      onClick={() => {
        if (typeof onClick == "function") {
          onClick();
        }
      }}
    >
      {icon}

      <Text size="xs" weight="light" className="w-full text-center">
        {name}
      </Text>
    </div>
  );
};

export default FlowItemCard;
