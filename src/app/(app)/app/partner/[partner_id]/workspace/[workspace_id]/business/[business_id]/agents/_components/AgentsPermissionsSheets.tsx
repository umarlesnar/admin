import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/Checkbox";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import React, { ReactElement, useState } from "react";

type Props = {
  children: ReactElement;
  currentPermissions: Record<string, boolean>;
  onSave: (updatedPermissions: Record<string, boolean>) => void;
};

const AgentsPermissionsSheets = ({
  children,
  currentPermissions,
  onSave,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [tempPermissions, setTempPermissions] = useState(currentPermissions);

  const handleSavePermissions = () => {
    onSave(tempPermissions); 
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px] h-screen flex flex-col p-5">
        <SheetHeader className="flex flex-row items-center gap-4">
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-[15px] h-[15px] text-text-primary" />
          </SheetClose>
          <SheetTitle className="text-xl font-semibold text-text-primary">
            Add Permissions
          </SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {Object.keys(currentPermissions).map((key) => (
            <div key={key} className="flex items-center gap-2">
              <Checkbox
                onCheckedChange={(checked) => {
                  setTempPermissions((prev: any) => ({
                    ...prev,
                    [key]: checked,
                  }));
                }}
                checked={!!tempPermissions[key]}
              />
              <Text size="sm">{key.replace(/_/g, " ")}</Text>
            </div>
          ))}
        </div>
        <div className=" mt-auto">
          <Text size="base" className="w-full py-2">
            {Object.values(tempPermissions).filter(Boolean).length}{" "}
            {Object.values(tempPermissions).filter(Boolean).length === 1
              ? "permission"
              : "permissions"}{" "}
            selected
          </Text>
          <div className="flex gap-2 ">
            <Button className="w-full" onClick={handleSavePermissions}>
              Save
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AgentsPermissionsSheets;
