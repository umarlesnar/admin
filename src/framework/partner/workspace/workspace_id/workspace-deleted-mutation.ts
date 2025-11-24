import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface IDeleteWorkspaceInput {
  partner_id: any;
  workspace_id: any;
}

export function deleteWorkspaceApi(input: IDeleteWorkspaceInput) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}`;
  return http.delete(finalUrl);
}


//custom hook
export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id, workspace_id } = useParams();
  return useMutation({
    mutationFn: (
      input: Omit<IDeleteWorkspaceInput, "partner_id,workspace_id">
    ) => deleteWorkspaceApi({ ...input, partner_id, workspace_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          API_ENDPOINTS.PARTNER,
          partner_id,
          API_ENDPOINTS.WORKSPACE,
          workspace_id
        ],
      });
    },
    onError: (error: any) => {
      console.error("Error Workspace Delected  mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};