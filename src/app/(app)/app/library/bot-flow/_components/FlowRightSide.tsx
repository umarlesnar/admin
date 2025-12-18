"use client";
import React, { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";
import MessageType from "./types/MessageType";
import useStore from "./store";
import CustomEdge from "./CustomEdge";
import QuestionType from "./types/QuestionType";
import ButtonType from "./types/ButtonType";
import ListType from "./types/ListType";
import ChatStatusType from "./types/ChatStatusType";
import FlowHeader from "./FlowHeader";
import TemplateType from "./types/TemplateType";
import OperatorType from "./types/OperatorType";
import TagType from "./types/TagType";
import BroadcastStatusType from "./types/BroadcastStatusType";
import SwitchType from "./types/SwitchType";
import CatalogueType from "./types/CatalogueType";
import CatalogueSetType from "./types/CatalogueSetType";
import CatalogueProductType from "./types/CatalogueProductType";
import OrderStatusType from "./types/OrderStatusType";
import OrderAddressType from "./types/OrderAddressType";
import SmsStatusType from "./types/SmsStatusType";
import WebhookType from "./types/WebhookType";
import ConditionType from "./types/ConditionType";
import GoogleSheetType from "./types/GoogleSheetType";
import UserPromptType from "./types/UserPromptType";
import OpenAiType from "./types/OpenAiType";
import RazorpayType from "./types/RazorpayType";
import AskAddressType from "./types/AskAddressType";
import ClearCartType from "./types/CartClearType";
import OrderType from "./types/OrderType";
import SendOrderStatusType from "./types/SendOrderStatus";
import TransformType from "./types/TransformType";
import NoteType from "./types/NoteType";
import AskMediaType from "./types/AskMediaType";
import SequenceType from "./types/SequenceType";
import WebViewType from "./types/WebViewType";
import CustomAttributeType from "./types/CustomAttributeType";
import TriggerChatbotType from "./types/TriggerChatbotType";
import SetDelayType from "./types/SetDelayType";
import GeideaType from "./types/GeideaType";
import AskLocationType from "./types/AskLocationType";

type Props = {};

const nodeColor = (node: any) => {
  switch (node.type) {
    case "webhook":
      return "yellow";
    case "condition":
      return "violet";
    case "switch":
      return "violet";
    case "question":
      return "orange";
    case "askAddress":
      return "orange";
    case "askLocation":
      return "blue";
    case "askMedia":
      return "orange";
      case "delay":
      return "yellow";
    case "choices":
      return "orange";
    case "choicesList":
      return "orange";
    case "message":
      return "red";
    case "updateChatStatus":
      return "#ffb6c1";
    case "template":
      return "yellow";
    case "assignAgent":
      return "skyblue";
    case "setTags":
      return "yellow";
    case "catalogType":
      return "green";
    case "catalogSet":
      return "blue";
    case "catalogProduct":
      return "#a855f7";
    case "clearCart":
      return "#a855f7";
    case "updateOrderStatus":
      return "#ffb6c1";
    case "updateBroadcastStatus":
      return "green";
    case "updateSmsStatus":
      return "blue";
    case "googleSheet":
      return "green";
    case "openAI":
      return "green";
    case "aiPrompt":
      return "green";
    case "media":
      return "blue";
    case "openAI":
      return "green";
    case "aiPrompt":
      return "green";
    case "rz_payment_link":
      return "green";
    case "geidea_payment_link":
      return "green";
    case "dataTransform":
      return "yellow";
    case "note":
      return "orange";
    case "whatsapp_order_status":
      return "green";
    case "webview":
      return "orange";
      case "custom_attribute":
        return "blue";
    case "trigger_chatbot":
        return "orange";
    default:
      return "#eee";
  }
};

const FlowRightSide = (props: Props) => {
  const { nodes, edges, name, onNodesChange, onEdgesChange, onConnect } =
    useStore();
  const nodeTypes = useMemo(
    () => ({
      webhook: WebhookType,
      condition: ConditionType,
      message: MessageType,
      // media: MediaType,
      question: QuestionType,
      choices: ButtonType,
      note: NoteType,
      choicesList: ListType,
      updateChatStatus: ChatStatusType,
      template: TemplateType,
      assignAgent: OperatorType,
      assignSequence: SequenceType,
      setTags: TagType,
      switch: SwitchType,
      catalogType: CatalogueType,
      catalogSet: CatalogueSetType,
      catalogProduct: CatalogueProductType,
      updateOrderStatus: OrderStatusType,
      setOrderAddress: OrderAddressType,
      clearCart: ClearCartType,
      updateBroadcastStatus: BroadcastStatusType,
      updateSmsStatus: SmsStatusType,
      googleSheet: GoogleSheetType,
      openAI: OpenAiType,
      aiPrompt: UserPromptType,
      rz_payment_link: RazorpayType,
      geidea_payment_link: GeideaType,
      order_details: OrderType,
      dataTransform: TransformType,
      whatsapp_order_status: SendOrderStatusType,
      askAddress: AskAddressType,
      askLocation: AskLocationType,
      askMedia: AskMediaType,
      webview: WebViewType,
      custom_attribute: CustomAttributeType,
      trigger_chatbot: TriggerChatbotType,
      delay: SetDelayType,
    }),
    []
  );

  const edgeTypes = useMemo(() => ({ buttonedge: CustomEdge }), []);

  const defaultViewport = { x: 0, y: 0, zoom: 3 };

  return (
    <div className="w-full min-h-full flex flex-col ">
      <FlowHeader />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // defaultEdgeOptions={edgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        //@ts-ignore
        edgeTypes={{ buttonedge: CustomEdge }}
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

export default FlowRightSide;
