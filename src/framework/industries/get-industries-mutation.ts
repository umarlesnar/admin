import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export default interface IIndustriesMutation {
  Industries_id?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export const IndustriesMutation = (input: IIndustriesMutation) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl =
      `${API_ENDPOINTS.INDUSTRIES}` + `/${input.Industries_id}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.INDUSTRIES}`;
    return http.post(finalUrl, input.payload);
  }
};

export const useIndustriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IIndustriesMutation) =>
        IndustriesMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.INDUSTRIES],
      });
    },
    onError: (error) => {
      console.error("Error Industries mutation:", error);
    },
  });
};
