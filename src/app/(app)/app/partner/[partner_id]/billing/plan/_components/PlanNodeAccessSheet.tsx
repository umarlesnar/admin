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

type Props = {
  children: ReactElement;
  data: any;
};

// --- CONSTANTS ---
// Added hint field
const BOT_FLOW_NODES_MASTER = [
  { name: "Ask Address", id: "askAddress", hint: "free" },
  { name: "Ask Media", id: "askMedia", hint: "free" },
  { name: "Campaign Status", id: "update_broadcast_status", hint: "pro" },
  { name: "Buttons", id: "choice_message", hint: "free" },
  { name: "Products", id: "catalog_product", hint: "pro" },
  { name: "Cart Clear", id: "clearCart", hint: "enterprise" },
  { name: "Catalog Set", id: "catalog_set", hint: "pro" },
  { name: "Catalog", id: "catalog", hint: "pro" },
  { name: "Chat Status", id: "update_chat_status", hint: "free" },
  { name: "Condition", id: "condition", hint: "pro" },
  { name: "Google Sheet", id: "googleSheet", hint: "enterprise" },
  { name: "Lists", id: "choice_list", hint: "free" },
  { name: "Send a Message", id: "main_message", hint: "free" },
  { name: "Note", id: "note", hint: "free" },
  { name: "Open AI", id: "openAI_message", hint: "enterprise" },
  { name: "User Prompt", id: "ai-prompt", hint: "pro" },
  { name: "Assign Operator", id: "assign_agent", hint: "free" },
  { name: "Order Details", id: "order_details", hint: "pro" },
  { name: "Order Status", id: "whatsapp_order_status", hint: "pro" },
  { name: "Question", id: "question", hint: "free" },
  { name: "Razorpay", id: "razorpay", hint: "enterprise" },
  { name: "Sequence", id: "assign_sequence", hint: "pro" },
  { name: "Switch", id: "switch_condition", hint: "pro" },
  { name: "Set Tags", id: "set_tags", hint: "free" },
  { name: "Template", id: "template", hint: "free" },
  { name: "Transform", id: "dataTransform", hint: "pro" },
  { name: "Webhook", id: "web_hook", hint: "enterprise" },
  { name: "Update Attribute", id: "custom_attribute", hint: "pro" },
  { name: "Trigger Chatbot", id: "trigger_chatbot", hint: "pro" },
  { name: "Webview", id: "webview", hint: "pro" }
];

const WORK_FLOW_NODES_MASTER = [
  { name: "Code", id: "javascript", hint: "enterprise" },
  { name: "Condition", id: "condition", hint: "pro" },
  { name: "Note", id: "note", hint: "free" },
  { name: "Order Details", id: "order_details", hint: "pro" },
  { name: "Order Status", id: "whatsapp_order_status", hint: "pro" },
  { name: "Set Delay", id: "delay", hint: "pro" },
  { name: "Shopify", id: "shopify", hint: "enterprise" },
  { name: "Switch", id: "switch_condition", hint: "pro" },
  { name: "Template", id: "template", hint: "free" },
  { name: "Transform", id: "dataTransform", hint: "enterprise" },
  { name: "Webhook", id: "web_hook", hint: "enterprise" },
  { name: "Update Attribute", id: "custom_attribute", hint: "pro" },
  { name: "Trigger Chatbot", id: "trigger_chatbot", hint: "pro" },
  { name: "Customer", id: "customer", hint: "pro" }
];

type NodeAccessItem = {
  name: string;
  id: string;
  enabled: boolean;
  hint: string; // Added hint string
};

type NodeAccessState = {
  bot_flow: NodeAccessItem[];
  work_flow: NodeAccessItem[];
};

const PlanNodeAccessSheet = ({ children, data }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutateAsync, isPending } = usePartnerProductMutation();
  
  const [nodesAccess, setNodesAccess] = useState<NodeAccessState>({
    bot_flow: [],
    work_flow: [],
  });

  // Initialize state: Merge master list with saved data
  useEffect(() => {
    if (open) {
      const savedAccess = data?.nodes_access || { bot_flow: [], work_flow: [] };

      // Helper to merge master list with saved state
      const mergeNodes = (masterList: any[], savedList: any[]) => {
        return masterList.map((masterNode) => {
          const savedNode = savedList?.find((n: any) => n.id === masterNode.id);
          return {
            name: masterNode.name,
            id: masterNode.id,
            enabled: savedNode ? savedNode.enabled : false, // Default to false if not found
            hint: savedNode?.hint || masterNode.hint || "free", // Use saved hint or master default
          };
        });
      };

      setNodesAccess({
        bot_flow: mergeNodes(BOT_FLOW_NODES_MASTER, savedAccess.bot_flow),
        work_flow: mergeNodes(WORK_FLOW_NODES_MASTER, savedAccess.work_flow),
      });
    }
  }, [data, open]);

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

  const handleChangeHint = (
    type: "bot_flow" | "work_flow",
    nodeId: string,
    hint: string
  ) => {
    setNodesAccess((prev) => {
      const list = prev[type].map((node) => {
        if (node.id === nodeId) {
          return { ...node, hint };
        }
        return node;
      });
      return { ...prev, [type]: list };
    });
  };

  const handleSave = async () => {
    const loadingToast = toast.loading("Updating Node Access...");
    try {
      await mutateAsync({
        product_id: data?._id,
        method: "PUT",
        payload: {
          ...data,
          nodes_access: nodesAccess, // Save the full structure with enabled flags and hint
        },
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

  const HintSelector = ({
    type,
    node,
  }: {
    type: "bot_flow" | "work_flow";
    node: NodeAccessItem;
  }) => {
    return (
      <div onClick={(e) => e.stopPropagation()} className="w-28">
        <Select
          value={node.hint}
          onValueChange={(val) => handleChangeHint(type, node.id, val)}
        >
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
                    Configure enabled nodes for this plan.
                  </SheetDescription>
                </div>
                <SheetClose asChild>
                  <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
                </SheetClose>
              </div>
            </SheetHeader>

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