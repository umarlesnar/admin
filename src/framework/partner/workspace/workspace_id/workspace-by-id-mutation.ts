import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

interface IWorkspaceStatusUpdateMutation {
  partner_id?: any;
  workspace_id?: any;
  method?: "PUT";
  payload?: {
    status: "ACTIVE" | "DISABLED" | "SUSPENDED";
  };
}

export function WorkspaceStatusUpdateMutationApi(
  input: IWorkspaceStatusUpdateMutation
) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}`;
  return http.put(finalUrl, input.payload);
}

//custom hook
export const usePWorkspaceStatusUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id, workspace_id } = useParams();
  return useMutation({
    mutationFn: (
      input: Omit<IWorkspaceStatusUpdateMutation, "partner_id,workspace_id">
    ) => WorkspaceStatusUpdateMutationApi({ ...input, partner_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          API_ENDPOINTS.PARTNER,
          partner_id,
          API_ENDPOINTS.WORKSPACE,
          workspace_id,
        ],
      });
    },
    onError: (error: any) => {
      console.error("Error Workspace Status update mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
