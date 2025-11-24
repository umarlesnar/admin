import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

interface IAddonMutation {
  addon_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function AddonMutationApi(input: IAddonMutation) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.ADDON}/${input.addon_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.ADDON}`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const useAddonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IAddonMutation) => AddonMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ADDON],
      });
    },
    onError: (error: any) => {
      console.error("Error Addon mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
