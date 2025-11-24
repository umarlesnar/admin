import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

interface IPartnerAlertMessageMutation {
    partner_id?: any;
  alert_message_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function PartnerAlertMessageMutationApi(input: IPartnerAlertMessageMutation) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.ALERT_MESSAGE}/${input.alert_message_id}`;
    console.log(finalUrl);

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.ALERT_MESSAGE}`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const usePartnerAlertMessageMutation = () => {
  const queryClient = useQueryClient();
   const { partner_id } = useParams();

  return useMutation({
    mutationFn: (input:  Omit<IPartnerAlertMessageMutation, "partner_id">) => PartnerAlertMessageMutationApi({...input,partner_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ API_ENDPOINTS.PARTNER,partner_id,API_ENDPOINTS.ALERT_MESSAGE],
      });
    },
    onError: (error: any) => {
      console.error("Error Partner Alert Message mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
