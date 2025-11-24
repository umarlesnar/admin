import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

export interface IUserMutation {
  user_id?: any;
  method: "POST" |  "DELETE";
  payload?: any;
}

export function userMutationApi(input: IUserMutation) {
  if(input.method == "DELETE"){
    const finalUrl = `${API_ENDPOINTS.IAM}${API_ENDPOINTS.USERS}/${input.user_id}`;
    return http.delete(finalUrl);
  } else {
    const finalUrl = `${API_ENDPOINTS.IAM}${API_ENDPOINTS.USERS}`;
    return http.post(finalUrl, input.payload);
  }
}

export const useUsersMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IUserMutation) => userMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.IAM,API_ENDPOINTS.USERS],
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

