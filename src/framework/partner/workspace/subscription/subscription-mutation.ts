import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

interface ISubscriptionMutation {
  partner_id?: any;
  workspace_id?: any;
  subscription_id?:any;
  payload?: any;
}

export function SubscriptionMutationApi(
  input: ISubscriptionMutation
) {
  if (input.subscription_id) {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/subscription/${input.subscription_id}`;
    return http.put(finalUrl, input.payload);
  }
  else{
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/subscription`;
    return http.post(finalUrl, input.payload);
  } 
}

//custom hook
export const useSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id, workspace_id } = useParams();
  return useMutation({
    mutationFn: (
      input: Omit<ISubscriptionMutation, "partner_id,workspace_id">
    ) => SubscriptionMutationApi({ ...input, partner_id, workspace_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          API_ENDPOINTS.PARTNER,
          partner_id,
          API_ENDPOINTS.WORKSPACE,
          workspace_id,
          "subscription",
        ],
      });
    },
    onError: (error: any) => {
      console.error("Error Subscription mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
