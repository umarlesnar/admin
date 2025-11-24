import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

interface ITemplateMutation {
  template_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function templateMutationApi(input: ITemplateMutation) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.TEMPLATE}${API_ENDPOINTS.LIBRARY}/${input.template_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.TEMPLATE}${API_ENDPOINTS.LIBRARY}`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const useTemplateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ITemplateMutation) => templateMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TEMPLATE, API_ENDPOINTS.LIBRARY],
      });
    },
    onError: (error: any) => {
      console.error("Error template mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
