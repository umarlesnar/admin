import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface IPartnerWorkspaceMutation {
  partner_id?: any;
  method: "POST";
  payload?: any;
}

export function PartnerWorkspaceMutationApi(input: IPartnerWorkspaceMutation) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}${API_ENDPOINTS.WORKSPACE}`;
  return http.post(finalUrl, input.payload);
}

export const usePartnerWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();
  return useMutation({
    mutationFn: (input: Omit<IPartnerWorkspaceMutation, "partner_id">) =>
      PartnerWorkspaceMutationApi({ ...input, partner_id }),
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
      console.error("Error Workspace mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
