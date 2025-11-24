import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

interface IWorkspaceModuleMutation {
  partner_id?: any;
  workspace_id?: any;
  payload?: any;
  method: "POST";
}

export function WorkspaceModuleMutationApi(
  input: IWorkspaceModuleMutation
) {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/${API_ENDPOINTS.MODULES}`;
    return http.post(finalUrl, input.payload);
}

//custom hook
export const useCreateWorkspaceModuleMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id, workspace_id } = useParams();
  return useMutation({
    mutationFn: (
      input: Omit<IWorkspaceModuleMutation, "partner_id,workspace_id">
    ) => WorkspaceModuleMutationApi({ ...input, partner_id, workspace_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          API_ENDPOINTS.PARTNER,
          partner_id,
          API_ENDPOINTS.WORKSPACE,
          workspace_id,
          API_ENDPOINTS.MODULES,
        ],
      });
    },
    onError: (error: any) => {
      console.error("Error Workspace Module mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
