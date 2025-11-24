// Updated StatusUpdateButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import StatusUpdateDialog from "./StatusUpdateDialog";

interface StatusUpdateButtonProps {
  workspaceId: string;
  currentStatus: string;
  onUpdate?: () => void;
}

const StatusUpdateButton = ({
  workspaceId,
  currentStatus,
  onUpdate,
}: StatusUpdateButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState("");

  const handleStatusClick = (status: string) => {
    setTargetStatus(status);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex gap-2">
        {currentStatus !== "ACTIVE" && (
          <Button size="sm" onClick={() => handleStatusClick("ACTIVE")}>
            Activate
          </Button>
        )}
        {currentStatus !== "DISABLE" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusClick("DISABLE")}
          >
            Disable
          </Button>
        )}
        {currentStatus !== "SUSPENDED" && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleStatusClick("SUSPENDED")}
          >
            Suspended
          </Button>
        )}
        {currentStatus !== "DELETION" && currentStatus !== "SUSPENDED" && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleStatusClick("DELETION")}
          >
            Deletion
          </Button>
        )}
      </div>

      <StatusUpdateDialog
        workspaceId={workspaceId}
        currentStatus={currentStatus}
        targetStatus={targetStatus}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default StatusUpdateButton;
