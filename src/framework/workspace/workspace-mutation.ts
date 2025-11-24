import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

export interface IWorkspaceMutation {
  method: "POST" ;
  payload?: any;
}

export function userMutationApi(input: IWorkspaceMutation) {
 const finalUrl = `${API_ENDPOINTS.WORKSPACE}`;
  return http.post(finalUrl, input.payload);
}

export const useWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IWorkspaceMutation) => userMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WORKSPACE],
      });
    },
    onError: (error: any) => {
         console.error("Error Workspace mutation:", error);
         if (error.response) {
           if (
             error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
           ) {
           }
         }
       },
  });
};

