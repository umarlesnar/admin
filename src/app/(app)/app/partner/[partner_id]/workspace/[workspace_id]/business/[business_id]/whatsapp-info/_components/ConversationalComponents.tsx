"use client";
import { Button } from "@/components/ui/button";
import { CommandsIcon } from "@/components/ui/icons/CommandsIcon";
import { IcebreakerIcon } from "@/components/ui/icons/IcebreakerIcon";
import Text from "@/components/ui/text";
import React from "react";
// import IceBreakerForm from "./IceBreakerForm";
// import CommandsForm from "./CommandsForm";
// import { useConversationalComponentsQuery } from "@/framework/whatsapp/get-conversational-components";

type Props = {};

const ConversationalComponents = (props: Props) => {
  // const { data } = useConversationalComponentsQuery();

  return (
    <div className="w-full space-y-3">
      <div className="w-full bg-neutral-20 border border-border-teritary rounded-md p-4 flex items-center gap-3">
        <IcebreakerIcon className="w-9 h-9 text-icon-secondary" />
        <div className="flex-1 space-y-1">
          <Text size="base" weight="semibold">
            Icebreaker
          </Text>
          <Text color="secondary">
            Simple questions people can ask to get the conversation going.
          </Text>
        </div>
        {/* <IceBreakerForm data={data}> */}
        <Button variant="outline">Set Up Now</Button>
        {/* </IceBreakerForm> */}
      </div>
      <div className="w-full bg-neutral-20 border border-border-teritary rounded-md p-4 flex items-center gap-3">
        <CommandsIcon className="w-9 h-9 text-icon-secondary" />
        <div className="flex-1 space-y-1">
          <Text size="base" weight="semibold">
            Commands
          </Text>
          <Text color="secondary">
            {`Use special keywords to guide the WhatsApp bot’s actions.`}
          </Text>
        </div>
        {/* <CommandsForm data={data}> */}
        <Button variant="outline">Set Up Now</Button>
        {/* </CommandsForm> */}
      </div>
    </div>
  );
};

export default ConversationalComponents;
