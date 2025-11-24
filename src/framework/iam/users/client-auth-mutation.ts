import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export interface IClientAuth {
  user_id: string; 
  auth_id: string;
  method?:"DELETE";
}

export const useClientAuth = ({ user_id, auth_id }: IClientAuth) => {
  const finalUrl = `${API_ENDPOINTS.IAM}${API_ENDPOINTS.USERS}/${user_id}/client-auth`;

  return http.delete(finalUrl, { data: { auth_id } }); 
};

export const useClientAuthUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: useClientAuth,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.IAM, API_ENDPOINTS.USERS, "client-auth"],
      });
    },
    onError: (error) => {
      console.error("Error deleting client authentication:", error);
    },
  });
};
