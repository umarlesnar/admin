"use client";
import React, { useEffect } from "react";
import FlowLeftSide from "../../../_components/FlowLeftSide";
import FlowRightSide from "../../../_components/FlowRightSide";
import { useParams } from "next/navigation";
import useStore from "../../../_components/store";
import { useBotFlowLibraryByIdQuery } from "@/framework/bot-flow-library/get-bot-flow-library-by-id";

type Props = {};

const EditFlowBuilder = (props: Props) => {
  const { flow_id } = useParams();
  const { setInitialNode } = useStore();

  const { data } = useBotFlowLibraryByIdQuery(flow_id);

  useEffect(() => {
    if (data) {
      if (typeof setInitialNode == "function") {
        setInitialNode({
          name: data?.name,
          industry: data?.industry,
          use_case: data?.use_case,
          description : data?.description,
          status: data?.status,
          nodes: data?.nodes,
          edges: data?.edges,
        });
      }
    }
  }, [data]);

  return (
    <div className="w-full h-full flex">
      <div className="w-[25%] h-full bg-white rounded-l-md border-r border-border-teritary overflow-y-auto ">
        <FlowLeftSide />
      </div>
      <div className="w-full min-h-full">
        <FlowRightSide />
      </div>
    </div>
  );
};

export default EditFlowBuilder;
