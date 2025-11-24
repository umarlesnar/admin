import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "../utils/http";

export interface IWorkFlowMutation {
  work_flow_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function workFlowMutationApi(
  input: IWorkFlowMutation,
) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.WORK_FLOW}/${input?.work_flow_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input?.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.WORK_FLOW}`;
    return http.post(finalUrl, input?.payload);
  }
}

//custom hook
export const useWorkFlowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IWorkFlowMutation) =>
      workFlowMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WORK_FLOW],
      });
    },
    onError: (error: any) => {
      console.error("Error Keyword Action mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
