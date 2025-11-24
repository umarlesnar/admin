import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

interface IAlertMessageMutation {
  alert_message_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function AlertMessageMutationApi(input: IAlertMessageMutation) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.ALERT_MESSAGE}/${input.alert_message_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.ALERT_MESSAGE}`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const useAlertMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IAlertMessageMutation) => AlertMessageMutationApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ALERT_MESSAGE],
      });
    },
    onError: (error: any) => {
      console.error("Error Alert Message mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
