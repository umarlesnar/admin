import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";

export interface IUserMutation {
  user_id?: any;
  payload?: any;
}

export function PasswordMutationApi(input: IUserMutation, business_id: string) {

  const finalUrl = `/business/${business_id}${API_ENDPOINTS.USERS}/${input.user_id}/reset`;

  return http.put(finalUrl, input.payload);
}

export const usePasswordMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: IUserMutation) => PasswordMutationApi(input, business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id, API_ENDPOINTS.USERS, "reset"],
      });
    },
    onError: (error: any) => {
      console.error("Error User mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};

