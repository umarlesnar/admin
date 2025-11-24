import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export default interface IPoliciesMutation {
  policy_id?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}


export const PoliciesMutation = (input: IPoliciesMutation) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl =
      `${API_ENDPOINTS.IAM}${API_ENDPOINTS.POLICIES}` + `/${input.policy_id}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.IAM}${API_ENDPOINTS.POLICIES}`;
    return http.post(finalUrl, input.payload);
  }
};

export const usePoliciesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IPoliciesMutation) => PoliciesMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.IAM,API_ENDPOINTS.POLICIES],
      });
    },
    onError: (error) => {
      console.error("Error policies mutation:", error);
    },
  });
};
