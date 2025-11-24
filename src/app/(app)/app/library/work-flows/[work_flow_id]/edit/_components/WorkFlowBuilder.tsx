"use client";
import React, { useEffect } from "react";
import WorkFlowHeader from "../../../_components/WorkFlowHeader";
import WorkFlowSampleData from "../../../_components/WorkFlowSampleData";
import WorkFlow from "../../../_components/WorkFlowRightSide";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { WorkflowNodeList } from "../../../_components/WorkflowNodeList";
import useWorkflowStore from "../../../_components/WorkflowStore";
import { useWorkFlowByIdQuery } from "@/framework/workflow-library/get-work-flow-by-id";

type Props = {};

const WorkFlowBuilder = (props: Props) => {
  const { setInitialNode } = useWorkflowStore();

  const { data } = useWorkFlowByIdQuery();

  useEffect(() => {
    if (data) {
      if (typeof setInitialNode == "function") {
        setInitialNode({
          name: data?.name,
          industry: data?.industry,
          use_case: data?.use_case,
          description: data?.description,
          nodes: data?.nodes,
          edges: data?.edges,
          status: data?.status,
        });
      }
    }
  }, [data]);
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <WorkFlowHeader />

      {/* Main Content Area */}
      <div className="w-full flex-1 flex overflow-hidden">
        {/* Yellow Section */}
        <div className="w-[70%] h-full relative">
          <WorkFlow />
          <WorkflowNodeList>
            <Button
              size="icon"
              className="absolute top-2 right-2 rounded-full z-50"
            >
              <PlusIcon />
            </Button>
          </WorkflowNodeList>
        </div>

        {/* Green Section with Scroll */}
        <div className="w-[30%] h-full overflow-y-auto">
          <WorkFlowSampleData />
        </div>
      </div>
    </div>
  );
};

export default WorkFlowBuilder;
