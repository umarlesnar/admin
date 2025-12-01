import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { useModulesQuery } from "@/framework/modules/get-modules";
import { Switch } from "@/components/ui/switch";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";

export type ModuleConfig = {
  module_id: string;
  enabled: boolean;
  is_visibility: boolean;
  config: Record<string, string>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (module: ModuleConfig) => void;
  initialData?: ModuleConfig | null;
  existingModuleIds: string[];
};

const PlanModuleConfigSheet = ({
  open,
  onClose,
  onSave,
  initialData,
  existingModuleIds,
}: Props) => {
  const [currentModule, setCurrentModule] = useState<ModuleConfig>({
    module_id: "",
    enabled: true,
    is_visibility: true,
    config: {},
  });

  const [configPairs, setConfigPairs] = useState<{ id: string; key: string; value: string }[]>([]);

  const Modules = useModulesQuery({
    per_page: 1000,
    page: 1,
    sort: {},
    filter: {},
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setCurrentModule(initialData);
        setConfigPairs(
          Object.entries(initialData.config || {}).map(([key, value]) => ({
            id: key,
            key,
            value: value as string,
          }))
        );
      } else {
        setCurrentModule({
          module_id: "",
          enabled: true,
          is_visibility: true,
          config: {},
        });
        setConfigPairs([]);
      }
    }
  }, [open, initialData]);

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  const handleSave = () => {
    if (!currentModule.module_id) {
      toast.error("Please select a module");
      return;
    }

    const isEditing = initialData?.module_id === currentModule.module_id;
    if (!isEditing && existingModuleIds.includes(currentModule.module_id)) {
      toast.error("Module already added to this plan");
      return;
    }

    const newConfig: Record<string, string> = {};
    configPairs.forEach((pair) => {
      if (pair.key.trim()) {
        newConfig[pair.key] = pair.value;
      }
    });

    onSave({
      ...currentModule,
      config: newConfig,
    });
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="w-[400px] sm:w-[500px] h-full flex flex-col p-0 bg-white"
        onOpenAutoFocus={preventFocus}
      >
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-xl font-semibold">
            {initialData ? "Edit Module" : "Add Module"}
          </SheetTitle>
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-4 h-4 text-text-primary" />
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <Text size="sm" weight="medium">
              Select Module
            </Text>
            <Combobox
              options={Modules?.data?.items?.filter((m: any) => m.is_active)}
              buttonClassname="w-full"
              dropdownClassname="p-2"
              placeholder="Select Module"
              selectedOption={Modules?.data?.items?.find(
                (o: any) => o.name === currentModule.module_id
              )}
              onSelectData={(type: any) => {
                const defaultKeys = type.config || {};
                const newPairs = Object.entries(defaultKeys).map(([k, v]) => ({
                  id: k,
                  key: k,
                  value: v as string,
                }));
                
                setCurrentModule({
                  ...currentModule,
                  module_id: type.name,
                });
                setConfigPairs(newPairs);
              }}
              disabled={!!initialData}
            />
          </div>

          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Text size="sm" weight="medium">
                  Enable Module
                </Text>
                <Text size="xs" color="secondary">
                  Active for use in this plan
                </Text>
              </div>
              <Switch
                checked={currentModule.enabled}
                onCheckedChange={(checked) =>
                  setCurrentModule({ ...currentModule, enabled: checked })
                }
              />
            </div>
            <div className="h-[1px] bg-gray-200 w-full" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Text size="sm" weight="medium">
                  Visibility
                </Text>
                <Text size="xs" color="secondary">
                  Visible to the end user
                </Text>
              </div>
              <Switch
                checked={currentModule.is_visibility}
                onCheckedChange={(checked) =>
                  setCurrentModule({ ...currentModule, is_visibility: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Text size="sm" weight="medium">
                Configuration Keys
              </Text>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => {
                  setConfigPairs([
                    ...configPairs,
                    { id: Date.now().toString(), key: "", value: "" },
                  ]);
                }}
              >
                <PlusIcon className="w-3 h-3 mr-1" /> Add Key
              </Button>
            </div>

            <div className="space-y-3">
              {configPairs.map((pair, index) => (
                <div key={pair.id} className="flex gap-2 items-start">
                  <Input
                    placeholder="Key"
                    value={pair.key}
                    className="h-9 text-sm"
                    onChange={(e) => {
                      const newPairs = [...configPairs];
                      newPairs[index].key = e.target.value;
                      setConfigPairs(newPairs);
                    }}
                  />
                  <Input
                    placeholder="Value"
                    value={pair.value}
                    className="h-9 text-sm"
                    onChange={(e) => {
                      const newPairs = [...configPairs];
                      newPairs[index].value = e.target.value;
                      setConfigPairs(newPairs);
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    onClick={() => {
                      const newPairs = configPairs.filter((_, i) => i !== index);
                      setConfigPairs(newPairs);
                    }}
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {configPairs.length === 0 && (
                <div className="text-center py-6 border border-dashed rounded-md bg-gray-50">
                  <Text size="xs" color="secondary">
                    No configuration keys added
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t bg-gray-50">
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="w-24">
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-32">
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PlanModuleConfigSheet;