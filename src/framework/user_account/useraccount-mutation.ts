import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

export interface IUserAccountMutation {
  user_account_id?: any;
  method?: "DELETE";
}

export function userAccountMutationApi(input: IUserAccountMutation) {
  const finalUrl = `${API_ENDPOINTS.USERACCOUNT}/${input.user_account_id}`;
  return http.delete(finalUrl);
}

export const useUserAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IUserAccountMutation) => userAccountMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USERACCOUNT],
      });
    },
    onError: (error: any) => {
         console.error("Error user account mutation:", error);
         if (error.response) {
           if (
             error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
           ) {
           }
         }
       },
  });
};

