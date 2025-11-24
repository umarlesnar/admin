import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export default interface IIntegrationCategoryMutation {
  category_id?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export const IntegrationCategoryMutation = (
  input: IIntegrationCategoryMutation
) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl =
      `${API_ENDPOINTS.INTEGRATIONS}${API_ENDPOINTS.CATEGORY}` +
      `/${input.category_id}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.INTEGRATIONS}${API_ENDPOINTS.CATEGORY}`;
    return http.post(finalUrl, input.payload);
  }
};

export const useIntgrationCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IIntegrationCategoryMutation) =>
      IntegrationCategoryMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.INTEGRATIONS, API_ENDPOINTS.CATEGORY],
      });
    },
    onError: (error) => {
      console.error("Error Usecase mutation:", error);
    },
  });
};
