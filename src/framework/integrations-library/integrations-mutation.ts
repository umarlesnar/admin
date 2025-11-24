import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export default interface IIntegrationMutation {
  integrations_id?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export const IntegrationMutation = (input: IIntegrationMutation) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl =
      `${API_ENDPOINTS.INTEGRATIONS}` + `/${input.integrations_id}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.INTEGRATIONS}`;
    return http.post(finalUrl, input.payload);
  }
};

export const useIntegrationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IIntegrationMutation) => IntegrationMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.INTEGRATIONS],
      });
    },
    onError: (error) => {
      console.error("Error Integration mutation:", error);
    },
  });
};
