import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface IWorkspaceUpdateMutation {
  partner_id?: any;
  workspace_id?: any;
  method: "PUT";
  payload?: any;
}

export function WorkspaceUpdateMutationApi(input: IWorkspaceUpdateMutation) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}`;
  return http.put(finalUrl, input.payload);
}

export const useWorkspaceUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id, workspace_id } = useParams();

  return useMutation({
    mutationFn: (
      input: Omit<IWorkspaceUpdateMutation, "partner_id" | "workspace_id">
    ) => WorkspaceUpdateMutationApi({ ...input, partner_id, workspace_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.WORKSPACE],
      });
    },
    onError: (error: any) => {
      console.error("Error updating workspace:", error);
      if (
        error.response?.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
      ) {
        // Handle unauthorized
      }
    },
  });
};
