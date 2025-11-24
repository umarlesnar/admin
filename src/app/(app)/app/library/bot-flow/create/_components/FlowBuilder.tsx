"use client";
import React from "react";
import FlowLeftSide from "../../_components/FlowLeftSide";
import FlowRightSide from "../../_components/FlowRightSide";

type Props = {};

const FlowBuilder = (props: Props) => {
  return (
    <div className="w-full h-full flex ">
      <div className="w-[25%] h-full bg-white rounded-l-md border-r border-border-teritary overflow-y-auto ">
        <FlowLeftSide />
      </div>
      <div className="w-full min-h-full">
        <FlowRightSide />
      </div>
    </div>
  );
};

export default FlowBuilder;
