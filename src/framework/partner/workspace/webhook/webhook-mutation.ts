import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

interface IWebhookMutation {
  partner_id?: any;
  workspace_id?: any;
  webhook_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function WebhooksMutationApi(
  input: IWebhookMutation
) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/webhook/${input.webhook_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/webhook`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const useWebhooksMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id, workspace_id } = useParams();
  return useMutation({
    mutationFn: (
      input: Omit<IWebhookMutation, "partner_id,workspace_id">
    ) => WebhooksMutationApi({ ...input, partner_id, workspace_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          API_ENDPOINTS.PARTNER,
          partner_id,
          API_ENDPOINTS.WORKSPACE,
          workspace_id,
          "webhook",
        ],
      });
    },
    onError: (error: any) => {
      console.error("Error Webhook mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
