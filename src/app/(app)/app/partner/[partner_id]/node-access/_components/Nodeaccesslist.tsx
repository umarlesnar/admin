// src/app/(app)/app/partner/[partner_id]/node-access/_components/Nodeaccesslist.tsx

"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/framework/utils/http";
import { WorkspaceComboBox } from "@/components/ui/WorkpsaceComboBox";
import Text from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { SettingsIcon } from "@/components/ui/icons/SettingsIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import { SearchBox } from "@/components/ui/SearchBox"; // Added SearchBox
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePartnerWorkspace } from "@/framework/partner/workspace/get-partner-workspace";
import RefreshButton from "@/components/ui/RefreshBotton";
import { LeftArrowIcon } from "@/components/ui/icons/LeftArrowIcon";
import { AngleRightIcon } from "@/components/ui/icons/AngleRightIcon";

const safeJSONParse = (jsonString: string | null, defaultValue: any) => {
  try {
    return jsonString ? JSON.parse(jsonString) : defaultValue;
  } catch (error) {
    console.error("JSON parse error for:", jsonString, error);
    return defaultValue;
  }
};

// ... [Existing CONSTANTS and TYPES remain the same] ...
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
  { name: "Delay", id: "delay", hint: "pro" },    
  { name: "Webhook", id: "web_hook", hint: "enterprise" },
  { name: "Update Attribute", id: "custom_attribute", hint: "pro" },
  { name: "Trigger Chatbot", id: "trigger_chatbot", hint: "pro" },
  { name: "Webview", id: "webview", hint: "pro" },
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
  { name: "Customer", id: "customer", hint: "pro" },
];

type NodePermissionItem = {
  name: string;
  id: string;
  enabled: boolean;
  hint: string;
};

type AvailableNodesState = {
  bot_flow: NodePermissionItem[];
  work_flow: NodePermissionItem[];
};

export default function NodeAccessList() {
  const params = useParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<any | null>(null);
  
  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [search, setSearch] = useState("");

  // 1. Fetch Configured Workspaces with Pagination & Search
  const {
    data: configuredData,
    isLoading: isConfiguredLoading,
    refetch: refetchConfigured,
  } = useQuery({
    queryKey: ["configured-workspaces", params.partner_id, page, pageSize, search],
    queryFn: async () => {
      const encodedSearch = encodeURIComponent(search);
      const res = await http.get(
        `/partner/${params.partner_id}/node-permissions?page=${page}&per_page=${pageSize}&q=${encodedSearch}`
      );
      return res.data;
    },
  });

  const configuredWorkspaces = useMemo(() => {
    return Array.isArray(configuredData?.data) ? configuredData.data : [];
  }, [configuredData]);

  const meta = useMemo(() => {
    return configuredData?.meta || { total_pages: 1, total: 0, current_page: page };
  }, [configuredData, page]);

  // 2. Fetch All Workspaces (for the dropdown in the sheet)
  const { data: workspaceData } = useQuery({
    queryKey: ["partner-workspaces", params.partner_id, isSheetOpen],
    queryFn: async () => {
      const res = await http.get(
        `/partner/${params.partner_id}/workspace?page=1&per_page=10000`
      );
      return res.data;
    },
    enabled: isSheetOpen,
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
    <div className="w-full h-full flex gap-4 p-4">
      <div className="flex-1 overflow-hidden bg-white rounded-xl border border-gray-200 flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary-500" />
            <div className="flex flex-col">
              <Text size="xl" weight="bold">
                Node Access Configuration
              </Text>
              <Text size="sm" color="secondary">
                Manage bot and workflow node availability per workspace
              </Text>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-[250px]">
              <SearchBox
                placeholder="Search workspaces..."
                onChange={(e: any) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
                value={search}
              />
            </div>
            <RefreshButton
              onClick={() => {
                refetchConfigured();
              }}
            />
            <Button onClick={handleAddNew}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Configure New
            </Button>
          </div>
        </div>

        {/* List of Configured Workspaces */}
        <Card className="flex-1 overflow-hidden flex flex-col border-none shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">Configured Workspaces</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto px-0">
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
                      // Count enabled nodes safely
                      const botCount =
                        ws.nodes_available?.bot_flow?.filter(
                          (n: any) => n.enabled
                        ).length || 0;
                      const workCount =
                        ws.nodes_available?.work_flow?.filter(
                          (n: any) => n.enabled
                        ).length || 0;

                      return (
                        <TableRow key={ws._id}>
                          <TableCell className="font-medium">
                            {ws.name}
                          </TableCell>
                          <TableCell>{ws.domain}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Badge variant="secondary">
                                {botCount} Bot Nodes
                              </Badge>
                              <Badge variant="secondary">
                                {workCount} Workflow Nodes
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(ws)}
                            >
                              <EditIcon className="w-4 h-4 text-gray-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-gray-500"
                      >
                        {search ? "No workspaces found matching your search." : `No workspaces configured yet. Click "Configure New" to start.`}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          
          {/* Pagination Controls */}
          {meta.total_pages > 1 && (
            <CardFooter className="flex items-center justify-between px-0 py-4 border-t">
              <div className="text-sm text-gray-500">
                Page {page} of {meta.total_pages} ({meta.total} items)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isConfiguredLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
                  disabled={page === meta.total_pages || isConfiguredLoading}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* Configuration Sheet - (NodeConfigurationForm component remains the same as previous logic, omitted here for brevity if unchanged, but include it if you copy paste) */}
        <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
          <SheetContent className="w-[900px] sm:w-[640px] flex flex-col h-full p-0 bg-white">
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 pb-0">
                <SheetHeader className="mb-6">
                  <SheetTitle>
                    {editingWorkspace
                      ? `Edit Access: ${editingWorkspace.name}`
                      : "Configure Workspace Access"}
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
    </div>
  );
}

// ... [NodeConfigurationForm component follows, identical to your provided file content] ...
function NodeConfigurationForm({
  initialWorkspace,
  allWorkspaces,
  onClose,
  onSave,
}: {
  initialWorkspace: any | null;
  allWorkspaces: any[];
  onClose: () => void;
  onSave: () => void;
}) {
    // ... [Include the existing form logic here]
    const params = useParams();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const workspace_id = params?.workspace_id as string;
  
    const [selectedWorkspace, setSelectedWorkspace] = useState<any | null>(
      initialWorkspace
    );
  
    const [nodesAccess, setNodesAccess] = useState<AvailableNodesState>({
      bot_flow: [],
      work_flow: [],
    });
  
    const [queryPage, setQueryPage] = useState(() => ({
      per_page: Number(searchParams.get("per_page") || "20"),
      page: Number(searchParams.get("page") || "1"),
      q: searchParams.get("q") || "",
      filter: safeJSONParse(searchParams.get("filter"), {
        status: "",
      }),
      sort: safeJSONParse(searchParams.get("sort"), { created_at: "-1" }),
    }));
  
    const initializeNodes = (savedConfig: any) => {
      const merge = (master: any[], saved: any[]) => {
        return master.map((m) => {
          const found = saved?.find((s: any) => s.id === m.id);
          return {
            name: m.name,
            id: m.id,
            enabled: found ? found.enabled : false,
            hint: found?.hint || m.hint || "free", // Use saved hint or master default
          };
        });
      };
  
      return {
        bot_flow: merge(BOT_FLOW_NODES_MASTER, savedConfig?.bot_flow || []),
        work_flow: merge(WORK_FLOW_NODES_MASTER, savedConfig?.work_flow || []),
      };
    };
  
    useEffect(() => {
      if (initialWorkspace) {
        setNodesAccess(initializeNodes(initialWorkspace.nodes_available));
      } else {
        setNodesAccess(initializeNodes({}));
      }
    }, [initialWorkspace]);
  
    const { data: freshPermissions, isLoading: isPermLoading } = useQuery({
      queryKey: ["node-permissions", selectedWorkspace?._id],
      queryFn: async () => {
        if (!selectedWorkspace?._id) return null;
        const res = await http.get(
          `/partner/${params.partner_id}/workspace/${selectedWorkspace._id}/node-permissions`
        );
        return res.data;
      },
      enabled: !!selectedWorkspace?._id && !initialWorkspace,
    });
  
    useEffect(() => {
      if (freshPermissions?.nodes_available) {
        setNodesAccess(initializeNodes(freshPermissions.nodes_available));
      } else if (selectedWorkspace && !initialWorkspace && !freshPermissions) {
        setNodesAccess(initializeNodes({}));
      }
    }, [freshPermissions, selectedWorkspace, initialWorkspace]);
  
    const mutation = useMutation({
      mutationFn: async (data: any) => {
        return http.post(
          `/partner/${params.partner_id}/workspace/${selectedWorkspace._id}/node-permissions`,
          data
        );
      },
      onSuccess: () => {
        toast.success("Node permissions updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["node-permissions", selectedWorkspace?._id],
        });
        onSave();
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update permissions");
      },
    });
  
    const handleToggleNode = (type: "bot_flow" | "work_flow", nodeId: string) => {
      setNodesAccess((prev) => {
        const newList = prev[type].map((node) => {
          if (node.id === nodeId) {
            return { ...node, enabled: !node.enabled };
          }
          return node;
        });
        return { ...prev, [type]: newList };
      });
    };
  
    const handleSelectAll = (type: "bot_flow" | "work_flow", enabled: boolean) => {
      setNodesAccess((prev) => {
        const newList = prev[type].map((node) => ({
          ...node,
          enabled,
        }));
        return { ...prev, [type]: newList };
      });
    };
  
    const { data: workspaceData } = usePartnerWorkspace(queryPage);
  
    const selectedWorkspaces = workspaceData?.items?.find(
      (item: any) => item._id === workspace_id
    );
  
    const handleChangeHint = (
      type: "bot_flow" | "work_flow",
      nodeId: string,
      hint: string
    ) => {
      setNodesAccess((prev) => {
        const newList = prev[type].map((node) => {
          if (node.id === nodeId) {
            return { ...node, hint };
          }
          return node;
        });
        return { ...prev, [type]: newList };
      });
    };
  
    const handleSave = () => {
      if (!selectedWorkspace) return;
      mutation.mutate({ nodes_available: nodesAccess });
    };
  
    const HintSelector = ({
      type,
      node,
    }: {
      type: "bot_flow" | "work_flow";
      node: NodePermissionItem;
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
  
    const botFlowAllSelected = nodesAccess.bot_flow.every((node) => node.enabled);
    const workFlowAllSelected = nodesAccess.work_flow.every((node) => node.enabled);
  
    return (
      <div className="flex flex-col h-full">
        {!initialWorkspace && (
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">
              Select Workspace to Configure
            </label>
            <WorkspaceComboBox
              options={
                workspaceData?.items.map((item: any) => ({
                  name: item.name,
                  value: item._id,
                })) || []
              }
              img_data={selectedWorkspaces?.workspace_logo_url}
              workspace_data={selectedWorkspaces?.name}
              imgUrl={`https://static.kwic.in${selectedWorkspaces?.workspace_logo_url}`}
              buttonClassname="w-full"
              dropdownClassname="p-2 w-[100%]"
              placeholder={selectedWorkspaces?.name || "Select Workspace"}
              onSelectData={(val: any) => {
                const workspace = allWorkspaces.find(
                  (ws) => ws._id === val.value
                );
                setSelectedWorkspace(workspace);
              }}
              onSearch={(searchText: string) =>
                setQueryPage((prev: any) => ({
                  ...prev,
                  q: searchText,
                  page: 1,
                }))
              }
            />
          </div>
        )}
  
        {selectedWorkspace ? (
          <>
            <div className="space-y-6 pb-8">
              {isPermLoading ? (
                <div className="text-sm text-gray-500">
                  Loading permissions...
                </div>
              ) : (
                <>
                  {/* Bot Flow Nodes */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      Bot Flow Nodes
                      <span className="text-xs font-normal bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                        {nodesAccess.bot_flow.filter((n) => n.enabled).length}{" "}
                        enabled
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 gap-0 border rounded-md divide-y">
                      {/* Select All Bot Flow */}
                      <div className="flex items-center justify-between space-x-3 p-3 bg-gray-50 border-b">
                        <div className="flex items-center space-x-3 flex-1">
                          <Checkbox
                            id="bot-select-all"
                            checked={botFlowAllSelected}
                            onCheckedChange={(checked) =>
                              handleSelectAll("bot_flow", !!checked)
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="bot-select-all"
                            className="text-sm font-medium leading-none cursor-pointer text-gray-900"
                          >
                            Select All Bot Flow Nodes
                          </label>
                        </div>
                      </div>
                      {nodesAccess.bot_flow.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between space-x-3 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              id={`bot-${node.id}`}
                              checked={node.enabled}
                              onCheckedChange={() =>
                                handleToggleNode("bot_flow", node.id)
                              }
                              className="mt-1"
                            />
                            <label
                              htmlFor={`bot-${node.id}`}
                              className="text-sm font-medium leading-none cursor-pointer text-gray-900 flex-1"
                            >
                              {node.name}
                            </label>
                          </div>
                          {node.enabled && (
                            <HintSelector type="bot_flow" node={node} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
  
                  {/* Workflow Nodes */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      Workflow Nodes
                      <span className="text-xs font-normal bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                        {nodesAccess.work_flow.filter((n) => n.enabled).length}{" "}
                        enabled
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 gap-0 border rounded-md divide-y">
                      {/* Select All Workflow */}
                      <div className="flex items-center justify-between space-x-3 p-3 bg-gray-50 border-b">
                        <div className="flex items-center space-x-3 flex-1">
                          <Checkbox
                            id="work-select-all"
                            checked={workFlowAllSelected}
                            onCheckedChange={(checked) =>
                              handleSelectAll("work_flow", !!checked)
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="work-select-all"
                            className="text-sm font-medium leading-none cursor-pointer text-gray-900"
                          >
                            Select All Workflow Nodes
                          </label>
                        </div>
                      </div>
                      {nodesAccess.work_flow.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between space-x-3 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              id={`work-${node.id}`}
                              checked={node.enabled}
                              onCheckedChange={() =>
                                handleToggleNode("work_flow", node.id)
                              }
                              className="mt-1"
                            />
                            <label
                              htmlFor={`work-${node.id}`}
                              className="text-sm font-medium leading-none cursor-pointer text-gray-900 flex-1"
                            >
                              {node.name}
                            </label>
                          </div>{" "}
                          {node.enabled && (
                            <HintSelector type="work_flow" node={node} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
  
            <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white border-t mt-auto flex justify-end gap-3 z-10">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
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