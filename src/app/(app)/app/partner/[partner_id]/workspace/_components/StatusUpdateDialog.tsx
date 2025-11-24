// StatusUpdateDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Text from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";
import { useStatusUpdateMutation } from "@/framework/partner/workspace/workspace_id/status-update-mutation";
import { toast } from "sonner";

interface StatusUpdateDialogProps {
  workspaceId: string;
  currentStatus: string;
  targetStatus: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const STATUS_TEMPLATES = {
  ACTIVE: [
    "Workspace reactivated after issue resolution",
    "Customer request to reactivate workspace",
    "Maintenance completed, workspace restored",
  ],
  DISABLE: [
    "Temporary maintenance required",
    "Customer requested temporary disable",
    "Performance optimization in progress",
  ],
  SUSPENDED: [
    "Payment overdue - suspended until resolved",
    "Terms of service violation",
    "Security concern - under investigation",
  ],
  DELETION: [
    "Customer requested account deletion",
    "Contract terminated",
    "Data retention period expired",
  ],
};

const STATUS_IMPACTS = {
  DISABLE: "Users will lose access, but data remains intact",
  SUSPEND: "All services stopped, data preserved for 30 days",
  DELETION: "⚠️ PERMANENT: All data will be deleted after 7 days",
};

const StatusUpdateDialog = ({
  workspaceId,
  currentStatus,
  targetStatus,
  isOpen,
  onClose,
  onUpdate,
}: StatusUpdateDialogProps) => {
  const [reason, setReason] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const { mutateAsync, isPending } = useStatusUpdateMutation();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Reason is required");
      return;
    }

    if (targetStatus === "DELETION" && !confirmed) {
      toast.error("Please confirm deletion by checking the box");
      return;
    }

    try {
      await mutateAsync({
        method: "PATCH",
        payload: {
          status: targetStatus as any,
          reason: reason.trim(),
          sendNotification,
        },
        workspace_id: workspaceId,
      });

      toast.success(`Status updated to ${targetStatus}`);
      onUpdate?.();
      onClose();
      resetForm();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setReason("");
    setSendNotification(true);
    setConfirmed(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Status to {targetStatus}</DialogTitle>
          <DialogDescription>
            Current status: {currentStatus} → {targetStatus}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Impact Warning */}
          {STATUS_IMPACTS[targetStatus as keyof typeof STATUS_IMPACTS] && (
            <Alert
              description={
                STATUS_IMPACTS[targetStatus as keyof typeof STATUS_IMPACTS]
              }
            ></Alert>
          )}

          {/* Reason Templates */}
          <div>
            <Text>Quick Reasons</Text>
            <Select onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template or write custom" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_TEMPLATES[
                  targetStatus as keyof typeof STATUS_TEMPLATES
                ]?.map((template, index) => (
                  <SelectItem key={index} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Reason */}
          <div>
            <Text>Reason *</Text>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for status change..."
              className="min-h-[80px]"
            />
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="notification"
              checked={sendNotification}
              onCheckedChange={setSendNotification}
            />
            <Text htmlFor="notification">
              Send notification to workspace users
            </Text>
          </div>

          {/* Deletion Confirmation */}
          {targetStatus === "DELETION" && (
            <div className="flex items-center space-x-2">
              <Switch
                id="confirm-deletion"
                checked={confirmed}
                onCheckedChange={setConfirmed}
              />
              <Text htmlFor="confirm-deletion" className="text-red-600">
                I understand this action cannot be undone
              </Text>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !reason.trim()}
            variant={targetStatus === "DELETION" ? "destructive" : "default"}
          >
            {isPending ? "Updating..." : `Update to ${targetStatus}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateDialog;
