import React, { useEffect, useRef, useState } from "react";
import Text from "@/components/ui/text";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { CustomComponentInput } from "@/components/ui/CustomComponentInput";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import useWorkflowStore from "./WorkflowStore";
import { Listbox } from "@/components/ui/listbox";
import { useWorkFlowMutation } from "@/framework/workflow-library/workflow-mutation";
import { Combobox } from "@/components/ui/combobox";
import { useIndustries } from "@/framework/industries/get-industries";
import { useUsecaseApi } from "@/framework/usecase/get-usecase";
import useStore from "../../bot-flow/_components/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import CustomTooltip from "@/components/ui/CustomTooltip";

type Props = {};

const STATUS_OPTIONS = [
  {
    name: "Active",
    value: "ACTIVE",
  },
  {
    name: "Disable",
    value: "DISABLE",
  },
];

const WorkFlowHeader = (props: Props) => {
  const inputRef = useRef<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [industries, setIndustries] = useState<string | null>(null);
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [useCase, setUseCase] = useState<string | null>(null);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  
  const {
    name,
    setFlowName,
    setFlowStatus,
    nodes,
    industry,
    use_case,
    edges,
    status,
    description: storeDescription,
    setDescription: setStoreDescription,
  }: any = useWorkflowStore();
  
  const { mutateAsync, isPending } = useWorkFlowMutation();
  const { work_flow_id } = useParams();

  const { data: industriesData } = useIndustries({});

  const { data: useCasesData } = useUsecaseApi({
    industries_id: industryId,
  });

  useEffect(() => {
    setNewName(name);
    setIndustries(industry);
    setUseCase(use_case);
    setDescription(storeDescription || "");
  }, [name, industry, use_case, storeDescription]);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const onNameChange = () => {
    if (newName) {
      setFlowName(newName);
      setIsEdit(false);
    } else {
      setFlowName("Untitled");
      setIsEdit(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast.success("URL copied to clipboard!");
      },
      (err) => {
        toast.error("Failed to copy the URL.");
      }
    );
  };

  const handleDescriptionSave = () => {
    if (setStoreDescription) {
      setStoreDescription(description);
    }
    setIsDescriptionDialogOpen(false);
    toast.success("Description updated successfully");
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Loading...");
    try {
      const startNode = nodes.find((o: any) => {
        return o?.data?.is_start_node;
      });

      let final_payload: any = {
        name: name,
        nodes: nodes,
        edges: edges,
        industry: industries || "UTILITY",
        use_case: useCase || "UTILITY",
        status: status,
        description: description, 
      };

      if (startNode) {
        final_payload.start_node_id = startNode.id;
      }

      const response = await mutateAsync({
        work_flow_id: work_flow_id,
        method: work_flow_id ? "PUT" : "POST",
        payload: final_payload,
      });
      toast.success(
        `Workflow ${work_flow_id ? "Update" : "Create"} successfully`,
        {
          id: loadingToast,
        }
      );
      if (!work_flow_id) {
        console.log("response", response);
      }
    } catch (error) {
      toast.error(`Fail to flow ${work_flow_id ? "Update" : "Create"}`, {
        id: loadingToast,
      });
      console.log("error", error);
    }
  };

  const truncateDescription = (desc: string, maxLength: number = 50) => {
    if (!desc) return "";
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full h-[70px] bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* Name Edit Section */}
        <div className="flex items-center gap-2">
          {isEdit ? (
            <Input
              ref={inputRef}
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onNameChange();
                }
              }}
              onBlur={(e: any) => {
                onNameChange();
              }}
              className="w-48"
            />
          ) : (
            <>
              <Text size="xl" weight="semibold">
                {name}
              </Text>
              <CustomTooltip value="Edit name">
                <EditIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                />
              </CustomTooltip>
            </>
          )}
        </div>

        {/* Description Display & Edit Section */}
        <div className="flex items-center gap-2">
          {description ? (
            <CustomTooltip value={description}>
              <div 
                className="flex items-center gap-2 cursor-pointer group max-w-[300px] p-2 rounded hover:bg-gray-100"
                onClick={() => setIsDescriptionDialogOpen(true)}
              >
                <Text size="sm" className="text-gray-600 truncate">
                  {truncateDescription(description)}
                </Text>
                <EditIcon className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
              </div>
            </CustomTooltip>
          ) : (
            <CustomTooltip value="Add description">
              <div 
                className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100"
                onClick={() => setIsDescriptionDialogOpen(true)}
              >
                <EditIcon className="w-4 h-4" />
                <Text size="sm" className="text-gray-400">
                  Add Description
                </Text>
              </div>
            </CustomTooltip>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-full space-y-1">
          <Combobox
            options={industriesData?.items?.filter(
              (item: any) => item.status === "ENABLE"
            )}
            buttonClassname="w-full"
            dropdownClassname={`p-2 text-sm`}
            placeholder={"Select Industry"}
            selectedOption={industriesData?.items?.find((o: any) => {
              return o?.name == industries;
            })}
            onSelectData={(selectedIndustry: any) => {
              setIndustries(selectedIndustry?.name);
              setIndustryId(selectedIndustry?._id);
              useStore.getState().setIndustryName?.(selectedIndustry?.name);
            }}
          />
        </div>

        <div className="w-full space-y-1">
          <Combobox
            options={useCasesData?.items || []}
            buttonClassname="w-full"
            dropdownClassname={`p-2`}
            placeholder={"Select Usecase"}
            selectedOption={useCasesData?.items?.find((o: any) => {
              return o.name == useCase;
            })}
            onSelectData={(selectedUseCase: any) => {
              setUseCase(selectedUseCase.name);
              useStore.getState().setUsecaseName?.(selectedUseCase.name);
            }}
          />
        </div>
        
        <Listbox
          options={STATUS_OPTIONS}
          selectedOption={STATUS_OPTIONS.find((o: any) => {
            return o.value == status;
          })}
          onSelectData={(value: any) => {
            setFlowStatus(value.value);
          }}
        />
        
        <CustomComponentInput
          inputClassName="px-1"
          className="h-8 px-0"
          disabled
          value={`${window.location.origin}/workflow/p/${work_flow_id}`}
          rightComponent={
            <Button
              variant="ghost"
              leftIcon={<CopyIcon className="w-4 h-4 mr-1" />}
              className="h-8 text-blue-500 hover:text-blue-600"
              onClick={() => {
                handleCopyLink(
                  `${window.location.origin}/workflow/p/${work_flow_id}`
                );
              }}
            >
              Copy URL
            </Button>
          }
        />

        <Button
          onClick={() => {
            if (typeof handleSubmit == "function") {
              handleSubmit();
            }
          }}
          disabled={isPending}
          loading={isPending}
        >
          Save
        </Button>
      </div>

      {/* Description Dialog */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {description ? "Edit Description" : "Add Description"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter workflow description..."
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDescriptionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleDescriptionSave}>
                {description ? "Update Description" : "Save Description"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkFlowHeader;