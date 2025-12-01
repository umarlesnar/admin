import { Button } from "@/components/ui/button";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import React, { useState } from "react";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { EditIcon } from "@/components/ui/icons/EditIcone";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import PlanModuleConfigSheet, { ModuleConfig } from "./PlanModuleConfigSheet";
import { ModulesIcon } from "@/components/ui/icons/ModulesIcon";

type Props = {
  open: boolean;
  onClose: () => void;
  modules: ModuleConfig[];
  onChange: (modules: ModuleConfig[]) => void;
};

const PlanIncludedModulesSheet = ({
  open,
  onClose,
  modules,
  onChange,
}: Props) => {
  const [configSheetOpen, setConfigSheetOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<{
    index: number;
    data: ModuleConfig;
  } | null>(null);

  const handleAdd = () => {
    setEditingModule(null);
    setConfigSheetOpen(true);
  };

  const handleEdit = (module: ModuleConfig, index: number) => {
    setEditingModule({ index, data: module });
    setConfigSheetOpen(true);
  };

  const handleDelete = (index: number) => {
    const newModules = [...modules];
    newModules.splice(index, 1);
    onChange(newModules);
  };

  const handleSaveModule = (moduleData: ModuleConfig) => {
    const newModules = [...modules];
    if (editingModule !== null) {
      newModules[editingModule.index] = moduleData;
    } else {
      newModules.push(moduleData);
    }
    onChange(newModules);
  };

  const preventFocus = (event: Event) => {
    event.preventDefault();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="w-[600px] h-full flex flex-col p-0 bg-white"
        onOpenAutoFocus={preventFocus}
      >
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <ModulesIcon className="w-5 h-5 text-primary" />
            <SheetTitle className="text-xl font-semibold">
              Manage Included Modules
            </SheetTitle>
          </div>
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-4 h-4 text-text-primary" />
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <Text size="sm" className="text-gray-500">
              {modules.length} modules configured
            </Text>
            <Button size="sm" onClick={handleAdd}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>

          <div className="space-y-3">
            {modules.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-gray-50">
                <ModulesIcon className="w-12 h-12 text-gray-300 mb-3" />
                <Text weight="medium" className="text-gray-500">
                  No modules added yet
                </Text>
                <Text size="sm" className="text-gray-400">
                  Click &quot;Add Module&quot; to get started
                </Text>
              </div>
            ) : (
              modules.map((module, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-white border rounded-lg hover:border-primary-200 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {module.module_id}
                      </span>
                      {!module.enabled && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            module.is_visibility
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        {module.is_visibility ? "Visible" : "Hidden"}
                      </span>
                      {Object.keys(module.config || {}).length > 0 && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span>
                            {Object.keys(module.config).length} Config Keys
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3"
                      onClick={() => handleEdit(module, index)}
                    >
                      <EditIcon className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Nested Configuration Sheet */}
        <PlanModuleConfigSheet
          open={configSheetOpen}
          onClose={() => setConfigSheetOpen(false)}
          onSave={handleSaveModule}
          initialData={editingModule?.data}
          existingModuleIds={modules.map((m) => m.module_id)}
        />
      </SheetContent>
    </Sheet>
  );
};

export default PlanIncludedModulesSheet;
