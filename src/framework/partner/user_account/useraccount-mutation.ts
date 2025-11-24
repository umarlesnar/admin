import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface IOnboardingUserAccountMutation {
  partner_id?: any;
  user_account_id?: any;
  method: "PUT" | "DELETE"; // Only allow PUT and DELETE
  payload?: any;
}

export function OnboardinguserAccountMutationApi(input: IOnboardingUserAccountMutation) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.USERACCOUNT}/${input.user_account_id}`;
  if (input.method === "DELETE") {
    return http.delete(finalUrl);
  } else {
    return http.put(finalUrl, input.payload);
  }
}


export const useOboardingUserAccountMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();
  return useMutation({
    mutationFn: (input: Omit<IOnboardingUserAccountMutation, "partner_id">) => OnboardinguserAccountMutationApi({...input,partner_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.USERACCOUNT],
      });
    },
    onError: (error: any) => {
         console.error("Error Onboarding user account mutation:", error);
         if (error.response) {
           if (
             error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
           ) {
           }
         }
       },
  });
};

