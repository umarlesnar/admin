"use client";
import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";
import useWorkflowStore from "./WorkflowStore";
import WorkflowTemplateType from "./workflow-types/TemplateType";
import WorkflowCodeType from "./workflow-types/CodeType";
import WorkflowCustomEdge from "./WorkflowCustomEdge";
import WorkflowConditionType from "./workflow-types/ConditionType";
import WorkflowSwitchType from "./workflow-types/SwitchConditionType";
import WorkflowSetDelayType from "./workflow-types/SetDelayType";
import WorkflowShopifyType from "./workflow-types/ShopifyType";
import WorkflowWebhookType from "./workflow-types/WebhookType";
import WorkflowOrderDetailsType from "./workflow-types/OrderDetailsType";
import WorkflowOrderStatusType from "./workflow-types/OrderStatusType";
import WorkflowTransformType from "./workflow-types/TransformType";
import NoteType from "./workflow-types/NoteType";
import WorkflowCustomAttributeType from "./workflow-types/CustomAttributeType";
import WorkflowTriggerChatbotType from "./workflow-types/TriggerChatbotType";
import WorkflowCustomerType from "./workflow-types/CustomerType";
type Props = {};

const nodeColor = (node: any) => {
  switch (node.type) {
    case "wb_template":
      return "red";
    case "javascript":
      return "blue";
    case "note":
      return "orange";
    case "dataTransform":
      return "blue";
    case "condition":
      return "violet";
    case "switch":
      return "violet";
    case "delay":
      return "yellow";
    case "shopify":
      return "green";
    case "whatsapp_order_status":
      return "green";
    case "webhook":
      return "yellow";
    case "order_details":
      return "green";
    case "custom_attribute":
      return "blue";
    case "trigger_chatbot":
      return "orange";
    case "customer":
      return "violet"; 
    default:
      return "#eee";
  }
};

const WorkFlow = (props: Props) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setIsValid } =
    useWorkflowStore();

  const nodeTypes = useMemo(
    () => ({
      wb_template: WorkflowTemplateType,
      javascript: WorkflowCodeType,
      note: NoteType,
      dataTransform: WorkflowTransformType,
      condition: WorkflowConditionType,
      switch: WorkflowSwitchType,
      delay: WorkflowSetDelayType,
      shopify: WorkflowShopifyType,
      webhook: WorkflowWebhookType,
      order_details: WorkflowOrderDetailsType,
      whatsapp_order_status: WorkflowOrderStatusType,
      custom_attribute: WorkflowCustomAttributeType,
      trigger_chatbot: WorkflowTriggerChatbotType,
      customer: WorkflowCustomerType,
    }),
    []
  );

  const edgeTypes = useMemo(() => ({ buttonedge: WorkflowCustomEdge }), []);

  const defaultViewport = { x: 0, y: 0, zoom: 3 };

  return (
    <div className="w-full min-h-full flex flex-col ">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // defaultEdgeOptions={edgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={setIsValid}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        //@ts-ignore
        edgeTypes={{ buttonedge: WorkflowCustomEdge }}
        //@ts-ignore
        // connectionLineComponent={CustomConnectionLine}
        snapGrid={[16, 16]}
        snapToGrid={true}
        fitView
        //@ts-ignore
        defaultViewport={defaultViewport}
        attributionPosition="top-right"
        className="w-full  flex-1 h-full"
      >
        <Controls />
        <MiniMap nodeColor={nodeColor} />

        <Background
          gap={10}
          //@ts-ignore
          variant="dots"
          color={"#E5E5E5"}
          size={1}
          className="bg-neutral-20"
        />
      </ReactFlow>
    </div>
  );
};

export default WorkFlow;
