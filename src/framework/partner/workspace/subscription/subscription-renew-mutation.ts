import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface IRenewSubscriptionPayload {
  start_at: number; // Unix timestamp
  end_at: number; // Unix timestamp
  payment_status: string;
}

export function renewPartnerWorkspaceSubscription(
  partner_id: string,
  workspace_id: string,
  subscription_id: string,
  payload: IRenewSubscriptionPayload
) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.WORKSPACE}/${workspace_id}/subscription/${subscription_id}/renew`;
  return http.post(finalUrl, payload);
}

export const useRenewPartnerWorkspaceSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const partner_id = params?.partner_id as string;
  const workspace_id = params?.workspace_id as string;

  return useMutation({
    mutationFn: ({ subscription_id, start_at, end_at, payment_status }: { subscription_id: string, start_at: number, end_at: number, payment_status: string }) => 
      renewPartnerWorkspaceSubscription(partner_id, workspace_id, subscription_id, { start_at, end_at, payment_status }),
    onSuccess: () => {
      toast.success("Subscription renewed successfully");
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.WORKSPACE, workspace_id, "subscription"],
      });
    },
    onError: (error: any) => {
      console.error("Error renewing subscription:", error);
      toast.error(error?.response?.data?.message || "Failed to renew subscription");
    },
  });
};