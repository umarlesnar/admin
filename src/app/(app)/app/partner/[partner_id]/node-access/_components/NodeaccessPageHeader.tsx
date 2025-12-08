"use client";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";
import Text from "@/components/ui/text";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import http from "@/framework/utils/http";

type Props = {};

const NodeaccessPageHeader = (props: Props) => {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncNodeAccess = async () => {
    setIsSyncing(true);
    try {
      const response = await http.post("/cron/subscription", {});
      toast.success(
        `Sync completed: ${response.data?.data?.synced_count || 0} subscriptions updated`
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to sync node access");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowIcon
            className="w-5 cursor-pointer text-icon-primary"
            onClick={() => {
              router?.back();
            }}
          />

          <Text size="2xl" weight="medium" color="primary">
            Node Access
          </Text>
        </div>
        <Button
          onClick={handleSyncNodeAccess}
          disabled={isSyncing}
          variant="outline"
          size="sm"
        >
          {isSyncing ? "Syncing..." : "Sync Old Subscriptions"}
        </Button>
      </div>
    </div>
  );
};

export default NodeaccessPageHeader;
