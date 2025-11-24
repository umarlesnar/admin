'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import WorkspaceStatusCard from "./WorkspaceStatusUpdateCard";
import DeleteWorkspaceAlert from "./WorkspaceDelectCard";
import { useParams } from "next/navigation";
import { useWorkspaceStatusByIdQuery } from "@/framework/partner/workspace/workspace_id/get-workspace-by-id";
import Text from "@/components/ui/text";

const WorkspaceSettingsCardsList = () => {
    const { workspace_id } = useParams();
    const { data, isLoading } = useWorkspaceStatusByIdQuery(workspace_id);
  
  return (
    <div className="px-2 py-6  flex-1 flex flex-col gap-6">
      <Card className="w-full h-full pb-4">
        <CardHeader className="space-y-3">
          <CardTitle className="text-text-primary">
            {`Workspace Status`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-4">
          <WorkspaceStatusCard />
        </CardContent>
      </Card>
      <Card className="w-full h-full pb-4 flex justify-between items-center">
        <CardHeader className="space-y-3">
          <CardTitle className="text-text-primary">
            {`Delete this Workspace`}
          </CardTitle>
          <div>
            <Text color="primary" size="sm">
            Once you delete a Workspace, there is no going back. Please be certain.
            </Text>
            </div>
        </CardHeader>
        <CardContent className="space-y-2 px-4">
          <DeleteWorkspaceAlert title={data?.title || "This Workspace"}  />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceSettingsCardsList;
