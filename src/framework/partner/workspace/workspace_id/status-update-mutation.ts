import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface IStatusUpdateMutation {
  partner_id?: any;
  workspace_id?: any;
  method: "PATCH";
  payload?: {
    status: "ACTIVE" | "DISABLE" | "SUSPEND" | "DELETION";
    reason?: string;
    sendNotification?: boolean;
  };
}

export function StatusUpdateMutationApi(input: IStatusUpdateMutation) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}${API_ENDPOINTS.WORKSPACE}/${input.workspace_id}/status`;
  return http.patch(finalUrl, input.payload);
}

export const useStatusUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();

  return useMutation({
    mutationFn: (input: Omit<IStatusUpdateMutation, "partner_id">) =>
      StatusUpdateMutationApi({ ...input, partner_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.WORKSPACE],
      });
    },
    onError: (error: any) => {
      console.error("Error updating status:", error);
      if (
        error.response?.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
      ) {
        // Handle unauthorized
      }
    },
  });
};
