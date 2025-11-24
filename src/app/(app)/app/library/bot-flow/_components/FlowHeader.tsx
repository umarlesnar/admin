import React, { useEffect, useRef, useState } from "react";
import useStore from "./store";
import Text from "@/components/ui/text";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { ExportFileIcon } from "@/components/ui/icons/ExportFileIcon";
import CustomTooltip from "@/components/ui/CustomTooltip";
import { JsonFileDownloader } from "@/lib/utils/json-file-downloader";
import { toast } from "sonner";
import { useBotFlowLibraryMutation } from "@/framework/bot-flow-library/bot-flow-library-mutation";
import { Combobox } from "@/components/ui/combobox";
import { useIndustries } from "@/framework/industries/get-industries";
import { useUsecaseApi } from "@/framework/usecase/get-usecase";
import { Listbox } from "@/components/ui/listbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Props = {};

const STATUS_OPTIONS = [
  {
    name: "Enabled",
    value: "ENABLED",
  },
  {
    name: "Disable",
    value: "DISABLE",
  },
];

const FlowHeader = (props: Props) => {
  const inputRef = useRef<any>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [industries, setIndustries] = useState<string | null>(null);
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [useCase, setUseCase] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("ENABLED");
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  
  const {
    name,
    setFlowName,
    nodes,
    edges,
    industry,
    use_case,
    description: storeDescription,
    setDescription: setStoreDescription,
  }: any = useStore();
  
  const { mutateAsync, isPending } = useBotFlowLibraryMutation();
  const { flow_id } = useParams();
  const router = useRouter();

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
      const response = await mutateAsync({
        flow_id: flow_id,
        method: flow_id ? "PUT" : "POST",
        payload: {
          name: name,
          nodes: nodes,
          edges: edges,
          industry: industries || "UTILITY", 
          use_case: useCase || "UTILITY", 
          status: status,
          description: description, 
        },
      });
      toast.success(`Flow ${flow_id ? "update" : "create"} successfully`, {
        id: loadingToast,
      });

      if (!flow_id) {
        console.log("response", response);
      }
    } catch (error) {
      toast.error(`Fail to flow ${flow_id ? "update" : "create"}`, {
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
      <div className="flex gap-4 items-center">
        {/* Name and Description Section */}
        <div className="flex items-center gap-6">
          {/* Name Edit */}
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

          {/* Description Display & Edit */}
          <div className="flex items-center gap-2">
            {description ? (
              <CustomTooltip value={description}>
                <div 
                  className="flex items-center gap-2 cursor-pointer group max-w-[300px]"
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
                  className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-gray-600"
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

        {/* Form Fields Section */}
        <div className="flex items-center w-full gap-4">
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
              setStatus(value.value);
            }}
          />
        </div>
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
              placeholder="Enter flow description..."
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

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <CustomTooltip value={"Export Flow"}>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              JsonFileDownloader(
                {
                  name: name,
                  nodes: nodes,
                  edges: edges,
                  description: description,
                },
                name
              );
            }}
          >
            <ExportFileIcon />
          </Button>
        </CustomTooltip>
        <Button
          variant="outline"
          onClick={() => {
            router.push("/app/library/bot-flow");
          }}
        >
          Cancel
        </Button>
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
    </div>
  );
};

export default FlowHeader;