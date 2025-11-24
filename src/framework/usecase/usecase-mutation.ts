import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export default interface IUsecaseMutation {
  usecase_id?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export const UsecaseMutation = (input: IUsecaseMutation) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.USECASE}` + `/${input.usecase_id}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.USECASE}`;
    return http.post(finalUrl, input.payload);
  }
};

export const useUsecaseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IUsecaseMutation) => UsecaseMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.USECASE],
      });
    },
    onError: (error) => {
      console.error("Error Usecase mutation:", error);
    },
  });
};
