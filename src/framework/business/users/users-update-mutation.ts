import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";

export interface IUserMutation {
  user_id?: any;
  method: "PUT" | "DELETE";
  payload?: any;
}

export function userMutationApi(input: IUserMutation, business_id: string) {
  const finalUrl = `/business/${business_id}${API_ENDPOINTS.USERS}/${input.user_id}`;

  if (input.method == "DELETE") {
    return http.delete(finalUrl);
  } else {
    return http.put(finalUrl, input.payload);
  }
}

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: IUserMutation) => userMutationApi(input, business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id, API_ENDPOINTS.USERS],
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
