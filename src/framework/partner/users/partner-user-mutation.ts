import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface IPartnerUserMutation {
    partner_id?: any;
  user_id?: any;
  method: "POST" |  "DELETE";
  payload?: any;
}

export function PartneruserMutationApi(input: IPartnerUserMutation) {
  if(input.method == "DELETE"){
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.USERS}/${input.user_id}`;
    return http.delete(finalUrl);
  } else {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}${API_ENDPOINTS.USERS}`;
    return http.post(finalUrl, input.payload);
  }
}

export const usePartnerUserMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();
  return useMutation({
mutationFn: (input:  Omit<IPartnerUserMutation, "partner_id">) => PartneruserMutationApi({...input,partner_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.USERS],
      });
    },
    onError: (error: any) => {
         console.error("Error user account mutation:", error);
         if (error.response) {
           if (
             error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
           ) {
           }
         }
       },
  });
};

