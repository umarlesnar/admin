import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface IBroadcastMutation {
  partner_id?: any;
  broadcast_id?: any;
  method: "DELETE";
  payload?: any;
}

export function BroadcastMutationApi(input: IBroadcastMutation) {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/broadcast/${input.broadcast_id}`;
  return http.delete(finalUrl);
}


export const useBroadcastMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();
  return useMutation({
    mutationFn: (input: Omit<IBroadcastMutation, "partner_id">) => BroadcastMutationApi({...input,partner_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id,"broadcast"],
      });
    },
    onError: (error: any) => {
         console.error("Error broadcast mutation:", error);
         if (error.response) {
           if (
             error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
           ) {
           }
         }
       },
  });
};

