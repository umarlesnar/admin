"use client";
import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/Checkbox";
import React, { ReactElement, useState, useEffect } from "react";
import { toast } from "sonner";
import { usePartnerProductMutation } from "@/framework/partner/partner-product-mutation";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import nodeAccessConfig from "@/framework/subscription/node-access-config.json";

type PlanType = "free" | "pro" | "enterprise";

type ProductData = {
  _id: string;
  name: string;
  current_plan?: PlanType;
  nodes_access?: NodeAccessState;
};

type Props = {
  children: ReactElement;
  data: ProductData;
};

const BOT_FLOW_NODES_MASTER = [
  { name: "Ask Address", id: "askAddress" },
  { name: "Ask Location", id: "askLocation" },
  { name: "Ask Media", id: "askMedia" },
  { name: "Campaign Status", id: "update_broadcast_status" },
  { name: "Buttons", id: "choice_message" },
  { name: "Products", id: "catalog_product" },
  { name: "Cart Clear", id: "clearCart" },
  { name: "Catalog Set", id: "catalog_set" },
  { name: "Catalog", id: "catalog" },
  { name: "Chat Status", id: "update_chat_status" },
  { name: "Condition", id: "condition" },
  { name: "Geidea", id: "geidea" },
  { name: "Google Sheet", id: "googleSheet" },
  { name: "Lists", id: "choice_list" },
  { name: "Send a Message", id: "main_message" },
  { name: "Note", id: "note" },
  { name: "Open AI", id: "openAI_message" },
  { name: "User Prompt", id: "ai-prompt" },
  { name: "Assign Operator", id: "assign_agent" },
  { name: "Order Details", id: "order_details" },
  { name: "Order Status", id: "whatsapp_order_status" },
  { name: "Question", id: "question" },
  { name: "Razorpay", id: "razorpay" },
  { name: "Sequence", id: "assign_sequence" },
  { name: "Switch", id: "switch_condition" },
  { name: "Set Tags", id: "set_tags" },
  { name: "Template", id: "template" },
  { name: "Transform", id: "dataTransform" },
  { name: "Webhook", id: "web_hook" },
  { name: "Update Attribute", id: "custom_attribute" },
  { name: "Trigger Chatbot", id: "trigger_chatbot" },
  { name: "Webview", id: "webview" }
];

const WORK_FLOW_NODES_MASTER = [
  { name: "Code", id: "javascript" },
  { name: "Condition", id: "condition" },
  { name: "Note", id: "note" },
  { name: "Order Details", id: "order_details" },
  { name: "Order Status", id: "whatsapp_order_status" },
  { name: "Set Delay", id: "delay" },
  { name: "Shopify", id: "shopify" },
  { name: "Switch", id: "switch_condition" },
  { name: "Template", id: "template" },
  { name: "Transform", id: "dataTransform" },
  { name: "Webhook", id: "web_hook" },
  { name: "Update Attribute", id: "custom_attribute" },
  { name: "Trigger Chatbot", id: "trigger_chatbot" },
  { name: "Customer", id: "customer" }
];

type NodeAccessItem = {
  name: string;
  id: string;
  enabled: boolean;
  hint: string;
};

type NodeAccessState = {
  bot_flow: NodeAccessItem[];
  work_flow: NodeAccessItem[];
};

type NodeAccessConfig = {
  nodeHints: Record<string, PlanType>;
  free: { bot_flow: string[]; work_flow: string[] };
  pro: { bot_flow: string[]; work_flow: string[] };
  enterprise: { bot_flow: string[]; work_flow: string[] };
};

const PlanNodeAccessSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync, isPending } = usePartnerProductMutation();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(data?.current_plan || "free");
  const [nodesAccess, setNodesAccess] = useState<NodeAccessState>({
    bot_flow: [],
    work_flow: [],
  });

  useEffect(() => {
    if (open) {
      const config = nodeAccessConfig as NodeAccessConfig;
      const planConfig = config[selectedPlan];
      const enabledBotIds = new Set(planConfig.bot_flow);
      const enabledWorkIds = new Set(planConfig.work_flow);
      const hints = config.nodeHints;

      setNodesAccess({
        bot_flow: BOT_FLOW_NODES_MASTER.map((node) => ({
          name: node.name,
          id: node.id,
          enabled: enabledBotIds.has(node.id),
          hint: hints[node.id] || "free",
        })),
        work_flow: WORK_FLOW_NODES_MASTER.map((node) => ({
          name: node.name,
          id: node.id,
          enabled: enabledWorkIds.has(node.id),
          hint: hints[node.id] || "free",
        })),
      });
    }
  }, [selectedPlan, open]);

  const handleToggleNode = (type: "bot_flow" | "work_flow", nodeId: string) => {
    setNodesAccess((prev) => {
      const list = prev[type].map((node) => {
        if (node.id === nodeId) {
          return { ...node, enabled: !node.enabled };
        }
        return node;
      });
      return { ...prev, [type]: list };
    });
  };

  const HintSelector = ({
    type,
    node,
  }: {
    type: "bot_flow" | "work_flow";
    node: NodeAccessItem;
  }) => {
    return (
      <div onClick={(e) => e.stopPropagation()} className="w-28">
        <Select value={node.hint} disabled>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Hint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const handleSave = async () => {
    const loadingToast = toast.loading("Updating Node Access...");
    try {
      const payload = {
        nodes_access: nodesAccess,
        current_plan: selectedPlan,
      };

      await mutateAsync({
        product_id: data._id,
        method: "PUT",
        payload,
      });
      
      toast.success(`Node Access Updated Successfully`, {
        id: loadingToast,
      });
      setOpen(false);
    } catch (error: any) {
      console.error("error", error);
      toast.error(`Failed to Update Node Access`, {
        id: loadingToast,
      });
    }
  };

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };



  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="w-[900px] sm:w-[640px] flex flex-col h-full p-0 bg-white"
        onOpenAutoFocus={preventFocus}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 pb-0">
            <SheetHeader className="mb-6">
              <div className="flex flex-row items-center justify-between">
                <div>
                  <SheetTitle className="text-xl font-semibold">
                    Node Access: {data?.name}
                  </SheetTitle>
                  <SheetDescription>
                    Select a plan to configure available nodes.
                  </SheetDescription>
                </div>
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="mb-6 flex gap-2">
              {(["free", "pro", "enterprise"] as const).map((plan) => (
                <Button
                  key={plan}
                  variant={selectedPlan === plan ? "default" : "outline"}
                  onClick={() => setSelectedPlan(plan)}
                  className="capitalize"
                  title={plan === data?.current_plan ? "Current plan" : ""}
                >
                  {plan}
                </Button>
              ))}
            </div>

            <div className="space-y-6 pb-8">
              {/* Bot Flow Nodes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  Bot Flow Nodes
                  <Badge variant="secondary">
                    {nodesAccess.bot_flow.filter(n => n.enabled).length} enabled
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 gap-0 border rounded-md divide-y">
                  {nodesAccess.bot_flow.map((node) => (
                    <div key={node.id} className="flex items-center justify-between space-x-3 p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox 
                            id={`bot-${node.id}`} 
                            checked={node.enabled}
                            onCheckedChange={() => handleToggleNode("bot_flow", node.id)}
                            className="mt-1"
                        />
                        <div className="flex flex-col cursor-pointer w-full" onClick={() => handleToggleNode("bot_flow", node.id)}>
                            <label 
                            htmlFor={`bot-${node.id}`} 
                            className="text-sm font-medium leading-none cursor-pointer text-gray-900"
                            >
                            {node.name}
                            </label>
                        </div>
                      </div>
                      {node.enabled && <HintSelector type="bot_flow" node={node} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Nodes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  Workflow Nodes
                  <Badge variant="secondary">
                    {nodesAccess.work_flow.filter(n => n.enabled).length} enabled
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 gap-0 border rounded-md divide-y">
                  {nodesAccess.work_flow.map((node) => (
                    <div key={node.id} className="flex items-center justify-between space-x-3 p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox 
                            id={`work-${node.id}`} 
                            checked={node.enabled}
                            onCheckedChange={() => handleToggleNode("work_flow", node.id)}
                            className="mt-1"
                        />
                        <div className="flex flex-col cursor-pointer w-full" onClick={() => handleToggleNode("work_flow", node.id)}>
                            <label 
                            htmlFor={`work-${node.id}`} 
                            className="text-sm font-medium leading-none cursor-pointer text-gray-900"
                            >
                            {node.name}
                            </label>
                        </div>
                      </div>
                      {node.enabled && <HintSelector type="work_flow" node={node} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t mt-auto flex justify-end gap-3 z-10">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Confirm & Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PlanNodeAccessSheet;