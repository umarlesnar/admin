import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

interface IWorkspaceSubscriptionMutation {
  workspace_id?: any;
  payload?: any;
}

export function updateWorkspaceSubscription(
  input: IWorkspaceSubscriptionMutation
) {
  const finalUrl = `${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/subscription`;
  return http.post(finalUrl, input.payload);
}
//custom hook
export const useWorkspaceSubscriptionMutation = () => {
  const queryClient = useQueryClient();

  const { partner_id } = useParams();

  return useMutation({
    mutationFn: updateWorkspaceSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WORKSPACE, "subscription"],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.WORKSPACE],
      });
    },
    onError: (error: any) => {
      console.error("Error updating workspace subscription:", error);
      if (
        error.response?.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
      ) {
        console.error("Error updating workspace subscription:", error);
      }
    },
  });
};
