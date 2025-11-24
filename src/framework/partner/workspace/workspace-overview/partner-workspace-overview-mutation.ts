import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

interface IWorkspaceOverviewMutation {
  partner_id?: any;
  workspace_id?: any;
  method?:"PUT" ;
  payload?: any;
}

export function PartnerWorkspaceOverviewMutationApi(
  input: IWorkspaceOverviewMutation
) {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/workspace-overview`;
      return http.put(finalUrl, input.payload);
}

//custom hook
export const usePartnerWorkspaceOverviewMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id, workspace_id } = useParams();
  return useMutation({
    mutationFn: (
      input: Omit<IWorkspaceOverviewMutation, "partner_id,workspace_id">
    ) => PartnerWorkspaceOverviewMutationApi({ ...input, partner_id, workspace_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          API_ENDPOINTS.PARTNER,
          partner_id,
          API_ENDPOINTS.WORKSPACE,
          workspace_id,
          "workspace-overview",
        ],
      });
    },
    onError: (error: any) => {
      console.error("Error workspace overview mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
