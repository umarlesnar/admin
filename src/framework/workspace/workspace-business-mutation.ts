import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface IWorkspaceBuisnessMutation {
  method: "POST";
  payload?: any;
  workspace_id?: any;
}

export function workspaceBusinessMutationApi(
  input: IWorkspaceBuisnessMutation
) {
  const finalUrl = `${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}`;
  return http.post(finalUrl, input.payload);
}

export const useWorkspaceBusinessMutation = () => {
  const queryClient = useQueryClient();
  const { workspace_id } = useParams();
  return useMutation({
    mutationFn: (input: Omit<IWorkspaceBuisnessMutation, "workspace_id">) =>
      workspaceBusinessMutationApi({ ...input, workspace_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WORKSPACE, workspace_id],
      });
    },
    onError: (error: any) => {
      console.error("Error Workspace Business mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
