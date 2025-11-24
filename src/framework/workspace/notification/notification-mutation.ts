import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

interface INotificationMutation {
    workspace_id?: any;
  notification_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function NotificationMutationApi(input: INotificationMutation) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/notifications/${input.notification_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/notifications`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const useNotificationMutation = () => {
  const queryClient = useQueryClient();
const { workspace_id } = useParams();
  return useMutation({
    mutationFn: (input:  Omit<INotificationMutation, "workspace_id">) => NotificationMutationApi({...input, workspace_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WORKSPACE, "notifications"],
      });
    },
    onError: (error: any) => {
      console.error("Error Notification mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
