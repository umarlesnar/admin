import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

interface IWebhookSubscriptionMutation {
  webhook_subscription_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function webhooksubscriptionMutationApi(input: IWebhookSubscriptionMutation) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.WEBHOOK}/${input.webhook_subscription_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.WEBHOOK}`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const useWebhookSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IWebhookSubscriptionMutation) => webhooksubscriptionMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WEBHOOK],
      });
    },
    onError: (error: any) => {
      console.error("Error webhook subscription mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
