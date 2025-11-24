"use client";
import { Button } from "@/components/ui/button";
import { FlowPlaceholderIcon } from "@/components/ui/icons/FlowPlaceholderIcon";
import Text from "@/components/ui/text";
import { useRouter } from "next/navigation";
import React from "react";
import useStore from "./store";

type Props = {};

const FlowEmptyPlaceholder = (props: Props) => {
  const router = useRouter();
  const { setInitialNode } = useStore();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <FlowPlaceholderIcon className="w-[100px] h-[100px]" />
      <Text size="xl" weight="semibold">
        Start Building Seamless Flows
      </Text>
      <div className="space-y-1">
        <Text color="teritary" className="text-center">
          Personalize responses to make each message feel unique.
        </Text>
        <Text color="teritary" className="text-center">
          Start by adding custom replies that reflect your brand voice.
        </Text>
      </div>
      <Button
        className="w-[274px]"
        onClick={() => {
          router.push("/app/bot-flow-library/create");
          if (typeof setInitialNode == "function") {
            setInitialNode({
              name: "Untitled",
              nodes: [],
              edges: [],
            });
          }
        }}
      >
        Create New Flow
      </Button>
    </div>
  );
};

export default FlowEmptyPlaceholder;
