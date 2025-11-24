import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

export function subscriptionCancelMutation(
  workspace_id: any,
  subscription_id: any
) {
  const finalUrl = `${API_ENDPOINTS.WORKSPACE}/${workspace_id}/subscription/${subscription_id}/cancel`;
  return http.put(finalUrl, {});
}
//custom hook
export const useSubscriptionCancelMutation = () => {
  const queryClient = useQueryClient();
  const { workspace_id } = useParams();

  return useMutation({
    mutationFn: (subscription_id) =>
      subscriptionCancelMutation(workspace_id, subscription_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WORKSPACE, "subscription"],
      });
    },
    onError: (error: any) => {
      console.error("Error cancel subscription:", error);
      if (
        error.response?.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
      ) {
        console.error("Error cancel subscription:", error);
      }
    },
  });
};
