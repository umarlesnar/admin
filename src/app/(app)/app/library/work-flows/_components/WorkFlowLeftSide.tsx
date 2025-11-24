import React from "react";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Text from "@/components/ui/text";
import { MessageIcon } from "@/components/ui/icons/MessageIcon";
import useStore from "../../bot-flow/_components/store";

type Props = {};

const WorkFlowLeftSide = (props: Props) => {
  const { setNewNode } = useStore();
  return (
    <div className="p-3 space-y-2 overflow-y-auto bg-scroll">
      {/* <SearchBox placeholder="Search Actions/Operations/Catalogs" /> */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-2 hover:no-underline">
            Actions
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div
              className="w-full h-10 border border-border-teritary rounded-md flex items-center gap-3 p-3 cursor-pointer"
              onClick={() =>
                setNewNode &&
                setNewNode("message", "main_message", {
                  flow_replies: {
                    type: "text",
                    data: "",
                  },
                  node_result_id: "",
                })
              }
            >
              <MessageIcon className="w-5 h-5 text-red-400" />
              <Text>Send a message</Text>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default WorkFlowLeftSide;
