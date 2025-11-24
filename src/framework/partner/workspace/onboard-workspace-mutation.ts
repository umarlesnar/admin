import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface IDeleteOnboardWorkspaceInput {
  partner_id: any;
  onboard_id: any;
  method: "DELETE";
}

export function deleteOnboardWorkspaceApi(input: IDeleteOnboardWorkspaceInput) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/onboard/${input.onboard_id}`;
  return http.delete(finalUrl);
}

//custom hook
export const useOnboardWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();
  return useMutation({
    mutationFn: (
      input: Omit<IDeleteOnboardWorkspaceInput, "partner_id">
    ) => deleteOnboardWorkspaceApi({ ...input, partner_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          API_ENDPOINTS.PARTNER,
          partner_id,
          API_ENDPOINTS.WORKSPACE,
          "onboard",
        ],
      });
    },
    onError: (error: any) => {
      console.error("Error Onboard Workspace Delected  mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};