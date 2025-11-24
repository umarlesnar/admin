"use client";

import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/ui/icons/DeleteIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useState } from "react";
import { useDeleteWorkspaceMutation } from "@/framework/partner/workspace/workspace_id/workspace-deleted-mutation";
import { AlertIcon } from "@/components/ui/icons/AlertIcon";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";

interface DeleteWorkspaceAlertProps {
  title: string;
}

const DeleteWorkspaceAlert: React.FC<DeleteWorkspaceAlertProps> = ({
  title,
}) => {
  const router = useRouter();
  const { partner_id, workspace_id } = useParams();
  const { mutateAsync } = useDeleteWorkspaceMutation();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting workspace...");
    try {
      await mutateAsync({ partner_id, workspace_id });
      toast.success("Workspace deleted successfully", {
        id: loadingToast,
      });
    } catch (error) {
      toast.error("Failed to delete workspace", {
        id: loadingToast,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-1 w-[150px] bg-red-500 hover:bg-red-600"
          leftIcon={<DeleteIcon className="w-4 h-4" />}
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <DialogTitle className="text-text-primary flex gap-2">
              Delete Workspace
              <AlertIcon className="w-4 h-4 text-red-500" />
            </DialogTitle>
            <CloseIcon
              className="w-4 h-4 text-icon-primary cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
        </DialogHeader>
        Are you sure you want to delete this workspace? This action is
        irreversible.
        <div className="mt-4 flex gap-2">
          <Button
            onClick={async () => {
              await handleDelete();
              setOpen(false);
              router.push(`/app/partner/${partner_id}/workspace`);
            }}
            className="bg-red-500 hover:bg-red-600"
            leftIcon={<DeleteIcon className="w-4 h-4 mr-1" />}
          >
            Yes, delete
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteWorkspaceAlert;
