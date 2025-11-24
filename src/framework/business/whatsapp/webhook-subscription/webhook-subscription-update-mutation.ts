import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";

function webhookMutationApi(input: any, business_id: string) {
  const finalUrl = `/business/${business_id}/whatsapp/webhook-subscription`;
  return http.put(finalUrl, input);
}

//custom hook
export const useWebhookUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: any) => webhookMutationApi(input, business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id,"whatsapp", "webhook-subscription"],
      });
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
    onError: (error: any) => {
      console.error("Error webhook update mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
