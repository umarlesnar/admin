import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

interface IProductMutation {
  product_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function ProductMutationApi(input: IProductMutation) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.PRODUCT}/${input.product_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.PRODUCT}`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const useProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IProductMutation) => ProductMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PRODUCT],
      });
    },
    onError: (error: any) => {
      console.error("Error Product mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
