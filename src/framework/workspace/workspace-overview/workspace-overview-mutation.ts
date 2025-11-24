import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";

interface IWorkspaceOverviewMutation {
  workspace_id?: any;
  method?: "PUT";
  payload?: any;
}

export function updateWorkspaceOverview(input: IWorkspaceOverviewMutation) {
    const finalUrl = `${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/workspace-overview`;
    return http.put(finalUrl, input.payload);
  }
//custom hook
export const useWorkspaceOverviewMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: updateWorkspaceOverview,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.WORKSPACE, "workspace-overview"],
        });
      },
      onError: (error: any) => {
        console.error("Error updating workspace overview:", error);
        if (
          error.response?.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
          console.error("Error updating workspace overview:", error);
        }
      },
    });
  };

