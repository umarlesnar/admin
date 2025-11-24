import { Alert } from "@/components/ui/alert";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import Text from "@/components/ui/text";
import { usePartnerWorkspaceUsers } from "@/framework/partner/users/workspace-user/get-workspace-users";
import { format } from "date-fns";
import React, { ReactElement, useState } from "react";

type Props = {
  children: ReactElement;
  user_id?: any;
};

const ViewWorkspaceUserSheet = ({ children, user_id }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading, error } = usePartnerWorkspaceUsers(user_id);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[450px] h-screen flex flex-col p-6 overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between mb-6">
          <SheetTitle className="text-text-primary text-xl font-semibold">
            User Workspace Details
          </SheetTitle>
          <SheetClose asChild>
            <CloseIcon className="cursor-pointer w-5 h-5 text-text-primary" />
          </SheetClose>
        </SheetHeader>

        <div className="flex-1">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="min-h-[250px] flex gap-8 justify-between p-4 mt-20 items-center w-full bg-neutral-40 rounded-xl animate-pulse"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32">
                  <Text className="text-red-500 text-lg">
                    Error loading workspace user data
                  </Text>
                </div>
              ) : data && data.length > 0 ? (
                <div className="space-y-4">
                  {data.map((workspaceUser: any, index: number) => (
                    <div key={`${workspaceUser._id}-${index}`} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <Text size="lg" weight="semibold" className="text-blue-600">
                          Workspace User #{index + 1}
                        </Text>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Text size="sm" weight="bold" color="primary">
                            Workspace Name
                          </Text>
                          <Text size="sm" weight="medium" className="text-gray-800">
                            {workspaceUser?.workspace?.name || "N/A"}
                          </Text>
                        </div>
                        <div className="flex items-center justify-between">
                          <Text size="sm" weight="bold" color="primary">
                            Name
                          </Text>
                          <Text size="sm" weight="medium" className="text-gray-800">
                            {workspaceUser?.first_name} {workspaceUser?.last_name}
                          </Text>
                        </div>
                        <div className="flex items-center justify-between">
                          <Text size="sm" weight="bold" color="primary">
                            Role
                          </Text>
                          <Text size="sm" weight="medium" className="text-gray-800">
                            {workspaceUser?.role || "N/A"}
                          </Text>
                        </div>
                        <div className="flex items-center justify-between">
                          <Text size="sm" weight="bold" color="primary">
                            Status
                          </Text>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            workspaceUser?.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {workspaceUser?.status || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <Text className="text-gray-500 text-lg">
                    No workspace data found for this user
                  </Text>
                </div>
              )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViewWorkspaceUserSheet;
