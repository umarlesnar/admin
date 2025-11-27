"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/framework/utils/http";
import { WorkspaceComboBox } from "@/components/ui/WorkpsaceComboBox";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsIcon } from "@/components/ui/icons/SettingsIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// --- CONSTANTS ---
const BOT_FLOW_NODES_MASTER = [
  { name: "Ask Address", id: "askAddress", hint: ["plan2", "pro", "enterprise"] },
  { name: "Ask Media", id: "askMedia", hint: ["plan2", "pro", "enterprise"] },
  { name: "Campaign Status", id: "update_broadcast_status", hint: ["pro", "enterprise"] },
  { name: "Buttons", id: "choice_message", hint: ["plan2", "pro", "enterprise"] },
  { name: "Products", id: "catalog_product", hint: ["pro", "enterprise"] },
  { name: "Cart Clear", id: "clearCart", hint: ["enterprise"] },
  { name: "Catalog Set", id: "catalog_set", hint: ["pro", "enterprise"] },
  { name: "Catalog", id: "catalog", hint: ["pro", "enterprise"] },
  { name: "Chat Status", id: "update_chat_status", hint: ["plan2", "pro", "enterprise"] },
  { name: "Condition", id: "condition", hint: ["pro", "enterprise"] },
  { name: "Google Sheet", id: "googleSheet", hint: ["enterprise"] },
  { name: "Lists", id: "choice_list", hint: ["plan2", "pro", "enterprise"] },
  { name: "Send a Message", id: "main_message", hint: ["plan2", "pro", "enterprise"] },
  { name: "Note", id: "note", hint: ["plan2", "pro", "enterprise"] },
  { name: "Open AI", id: "openAI_message", hint: ["enterprise"] },
  { name: "User Prompt", id: "ai-prompt", hint: ["pro", "enterprise"] },
  { name: "Assign Operator", id: "assign_agent", hint: ["plan2", "pro", "enterprise"] },
  { name: "Order Details", id: "order_details", hint: ["pro", "enterprise"] },
  { name: "Order Status", id: "whatsapp_order_status", hint: ["pro", "enterprise"] },
  { name: "Question", id: "question", hint: ["plan2", "pro", "enterprise"] },
  { name: "Razorpay", id: "razorpay", hint: ["enterprise"] },
  { name: "Sequence", id: "assign_sequence", hint: ["pro", "enterprise"] },
  { name: "Switch", id: "switch_condition", hint: ["pro", "enterprise"] },
  { name: "Set Tags", id: "set_tags", hint: ["plan2", "pro", "enterprise"] },
  { name: "Template", id: "template", hint: ["plan2", "pro", "enterprise"] },
  { name: "Transform", id: "dataTransform", hint: ["pro", "enterprise"] },
  { name: "Webhook", id: "web_hook", hint: ["enterprise"] },
  { name: "Update Attribute", id: "custom_attribute", hint: ["pro", "enterprise"] },
  { name: "Trigger Chatbot", id: "trigger_chatbot", hint: ["pro", "enterprise"] }
];

const WORK_FLOW_NODES_MASTER = [
  { name: "Code", id: "javascript", hint: ["enterprise"] },
  { name: "Condition", id: "condition", hint: ["pro", "enterprise"] },
  { name: "Note", id: "note", hint: ["plan2", "pro", "enterprise"] },
  { name: "Order Details", id: "order_details", hint: ["pro", "enterprise"] },
  { name: "Order Status", id: "whatsapp_order_status", hint: ["pro", "enterprise"] },
  { name: "Set Delay", id: "delay", hint: ["pro", "enterprise"] },
  { name: "Shopify", id: "shopify", hint: ["enterprise"] },
  { name: "Switch", id: "switch_condition", hint: ["pro", "enterprise"] },
  { name: "Template", id: "template", hint: ["plan2", "pro", "enterprise"] },
  { name: "Transform", id: "dataTransform", hint: ["enterprise"] },
  { name: "Webhook", id: "web_hook", hint: ["enterprise"] },
  { name: "Update Attribute", id: "custom_attribute", hint: ["pro", "enterprise"] },
  { name: "Trigger Chatbot", id: "trigger_chatbot", hint: ["pro", "enterprise"] },
  { name: "Customer", id: "customer", hint: ["pro", "enterprise"] }
];

// --- TYPES ---
type NodePermission = {
  name: string;
  id: string;
  hint?: string[];
};

type AvailableNodesState = {
  bot_flow: NodePermission[];
  work_flow: NodePermission[];
};

// --- MAIN PAGE COMPONENT ---

export default function NodeAccessPage() {
  const params = useParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<any | null>(null);

  // 1. Fetch Configured Workspaces
  const { data: configuredData, isLoading: isConfiguredLoading, refetch: refetchConfigured } = useQuery({
    queryKey: ["configured-workspaces", params.partner_id],
    queryFn: async () => {
      const res = await http.get(`/partner/${params.partner_id}/node-permissions`);
      return res.data; 
    },
  });

  const configuredWorkspaces = useMemo(() => {
    return configuredData?.data || [];
  }, [configuredData]);

  // 2. Fetch All Workspaces
  const { data: workspaceData } = useQuery({
    queryKey: ["partner-workspaces", params.partner_id],
    queryFn: async () => {
      const res = await http.get(`/partner/${params.partner_id}/workspace?page=1&limit=100`);
      return res.data;
    },
    enabled: isSheetOpen
  });

  const allWorkspaces = useMemo(() => {
    if (!workspaceData) return [];
    if (workspaceData?.data?.items && Array.isArray(workspaceData.data.items)) {
      return workspaceData.data.items;
    }
    if (Array.isArray(workspaceData)) return workspaceData;
    if (Array.isArray(workspaceData.data)) return workspaceData.data;
    return [];
  }, [workspaceData]);

  const handleAddNew = () => {
    setEditingWorkspace(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (workspace: any) => {
    setEditingWorkspace(workspace);
    setIsSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setEditingWorkspace(null);
    }
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary-500" />
          <div className="flex flex-col">
            <Text size="xl" weight="bold">Node Access Configuration</Text>
            <Text size="sm" color="secondary">Manage bot and workflow node availability per workspace</Text>
          </div>
        </div>
        <Button onClick={handleAddNew}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Configure New
        </Button>
      </div>

      {/* List of Configured Workspaces */}
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Configured Workspaces</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {isConfiguredLoading ? (
             <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workspace Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Enabled Nodes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configuredWorkspaces.length > 0 ? (
                  configuredWorkspaces.map((ws: any) => {
                    const botCount = ws.nodes_available?.bot_flow?.length || 0;
                    const workCount = ws.nodes_available?.work_flow?.length || 0;
                    
                    return (
                      <TableRow key={ws._id}>
                        <TableCell className="font-medium">{ws.name}</TableCell>
                        <TableCell>{ws.domain}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{botCount} Bot Nodes</Badge>
                            <Badge variant="secondary">{workCount} Workflow Nodes</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(ws)}>
                            <EditIcon className="w-4 h-4 text-gray-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                      No workspaces configured yet. Click "Configure New" to start.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Configuration Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
        {/* Removed padding p-6 from SheetContent to allow footer to sit flush */}
        <SheetContent className="w-[900px] sm:w-[640px] flex flex-col h-full p-0 bg-white">
          <div className="flex-1 overflow-y-auto">
             {/* Added padding here for content */}
             <div className="p-6 pb-0">
                <SheetHeader className="mb-6">
                  <SheetTitle>
                    {editingWorkspace ? `Edit Access: ${editingWorkspace.name}` : "Configure Workspace Access"}
                  </SheetTitle>
                  <SheetDescription>
                    Select a workspace and choose which nodes to enable.
                  </SheetDescription>
                </SheetHeader>
                
                <NodeConfigurationForm 
                  initialWorkspace={editingWorkspace}
                  allWorkspaces={allWorkspaces}
                  onClose={() => handleSheetClose(false)}
                  onSave={() => refetchConfigured()} 
                />
             </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// --- SUB-COMPONENT: FORM ---

function NodeConfigurationForm({ 
  initialWorkspace, 
  allWorkspaces, 
  onClose,
  onSave
}: { 
  initialWorkspace: any | null, 
  allWorkspaces: any[], 
  onClose: () => void,
  onSave: () => void
}) {
  const params = useParams();
  const queryClient = useQueryClient();
  const [selectedWorkspace, setSelectedWorkspace] = useState<any | null>(initialWorkspace);
  
  const [availableNodes, setAvailableNodes] = useState<AvailableNodesState>({
    bot_flow: [],
    work_flow: [],
  });

  useEffect(() => {
    if (selectedWorkspace) {
      if (selectedWorkspace.nodes_available) {
        setAvailableNodes(selectedWorkspace.nodes_available);
      } else {
        setAvailableNodes({ bot_flow: [], work_flow: [] });
      }
    }
  }, [selectedWorkspace]);

  const { data: freshPermissions, isLoading: isPermLoading } = useQuery({
    queryKey: ["node-permissions", selectedWorkspace?._id],
    queryFn: async () => {
      if (!selectedWorkspace?._id) return null;
      const res = await http.get(
        `/partner/${params.partner_id}/workspace/${selectedWorkspace._id}/node-permissions`
      );
      return res.data;
    },
    enabled: !!selectedWorkspace?._id,
  });

  useEffect(() => {
    if (freshPermissions?.nodes_available) {
      setAvailableNodes(freshPermissions.nodes_available);
    }
  }, [freshPermissions]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return http.post(
        `/partner/${params.partner_id}/workspace/${selectedWorkspace._id}/node-permissions`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Node permissions updated successfully");
      queryClient.invalidateQueries({ queryKey: ["node-permissions", selectedWorkspace?._id] });
      onSave();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });

  const handleToggleNode = (type: "bot_flow" | "work_flow", masterNode: any) => {
    setAvailableNodes((prev) => {
      const currentList = prev[type] || [];
      const exists = currentList.find((n: any) => n.id === masterNode.id);
      
      let newList;
      if (exists) {
        newList = currentList.filter((n: any) => n.id !== masterNode.id);
      } else {
        newList = [...currentList, { 
          name: masterNode.name, 
          id: masterNode.id, 
          hint: masterNode.hint 
        }];
      }
      return { ...prev, [type]: newList };
    });
  };

  const handleSave = () => {
    if (!selectedWorkspace) return;
    mutation.mutate({ nodes_available: availableNodes });
  };

  return (
    <div className="flex flex-col h-full">
      {!initialWorkspace && (
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Select Workspace to Configure</label>
          <WorkspaceComboBox
            options={allWorkspaces}
            selectedOption={selectedWorkspace}
            onSelectData={(val: any) => setSelectedWorkspace(val)}
            placeholder="Search workspace..."
            buttonClassname="w-full justify-between"
            dropdownClassname="w-[350px]"
          />
        </div>
      )}

      {selectedWorkspace ? (
        <>
          <div className="space-y-6 pb-8">
            {isPermLoading ? (
               <div className="text-sm text-gray-500">Loading permissions...</div>
            ) : (
              <>
              {/* Bot Flow Nodes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  Bot Flow Nodes
                  <span className="text-xs font-normal bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                    {availableNodes.bot_flow?.length || 0} enabled
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-0 border rounded-md divide-y">
                  {BOT_FLOW_NODES_MASTER.map((node) => {
                    const isEnabled = availableNodes.bot_flow?.some((n) => n.id === node.id);
                    return (
                      <div key={node.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 transition-colors">
                        <Checkbox 
                          id={`bot-${node.id}`} 
                          checked={isEnabled}
                          onCheckedChange={() => handleToggleNode("bot_flow", node)}
                          className="mt-1"
                        />
                        <div className="flex flex-col cursor-pointer w-full" onClick={() => handleToggleNode("bot_flow", node)}>
                          <label 
                            htmlFor={`bot-${node.id}`} 
                            className="text-sm font-medium leading-none cursor-pointer text-gray-900"
                          >
                            {node.name}
                          </label>
                          <span className="text-xs text-gray-500 mt-1">
                            Available in: {Array.isArray(node.hint) ? node.hint.join(", ") : node.hint}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Workflow Nodes */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  Workflow Nodes
                  <span className="text-xs font-normal bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                    {availableNodes.work_flow?.length || 0} enabled
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-0 border rounded-md divide-y">
                  {WORK_FLOW_NODES_MASTER.map((node) => {
                    const isEnabled = availableNodes.work_flow?.some((n) => n.id === node.id);
                    return (
                      <div key={node.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 transition-colors">
                        <Checkbox 
                          id={`work-${node.id}`} 
                          checked={isEnabled}
                          onCheckedChange={() => handleToggleNode("work_flow", node)}
                          className="mt-1"
                        />
                        <div className="flex flex-col cursor-pointer w-full" onClick={() => handleToggleNode("work_flow", node)}>
                          <label 
                            htmlFor={`work-${node.id}`} 
                            className="text-sm font-medium leading-none cursor-pointer text-gray-900"
                          >
                            {node.name}
                          </label>
                          <span className="text-xs text-gray-500 mt-1">
                            Available in: {Array.isArray(node.hint) ? node.hint.join(", ") : node.hint}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              </>
            )}
          </div>

          {/* Sticky Footer for Save Action - Added negative margin to compensate parent padding if needed, or better yet, using full width style */}
          <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white border-t mt-auto flex justify-end gap-3 z-10">
            <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
            <Button onClick={handleSave} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Confirm & Save"}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed rounded-md m-1">
          <p>Please select a workspace above to begin configuration</p>
        </div>
      )}
    </div>
  );
}