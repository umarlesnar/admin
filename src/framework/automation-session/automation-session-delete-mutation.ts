import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface IAutomationSessionMutation {
  partner_id?: any;
  automation_session_id?: any;
  method: "DELETE";
  payload?: any;
}

export function AutomationSessionMutationApi(
  input: IAutomationSessionMutation
) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/automation-session/${input.automation_session_id}`;
  return http.delete(finalUrl);
}

export const useAutomationSessionMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();
  return useMutation({
    mutationFn: (input: Omit<IAutomationSessionMutation, "partner_id">) =>
      AutomationSessionMutationApi({ ...input, partner_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id, "automation-session"],
      });
    },
    onError: (error: any) => {
      console.error("Error automation session mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
