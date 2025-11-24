import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

export interface ITemplateMutation {
  business_id?: any;
  template_id?: any;
  method: "PUT";
  payload?: any;
}

export function TemplateMutationApi(input: ITemplateMutation) {
  const finalUrl = `${API_ENDPOINTS.BUSINESS}/${input.business_id}/${API_ENDPOINTS.TEMPLATE}/${input.template_id}`;
  return http.put(finalUrl, input.payload);
}


export const useTemplateUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { business_id } = useParams();
  return useMutation({
    mutationFn: (input: Omit<ITemplateMutation, "business_id">) => TemplateMutationApi({...input,business_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BUSINESS, business_id, API_ENDPOINTS.TEMPLATE],
      });
    },
    onError: (error: any) => {
         console.error("Error Template mutation:", error);
         if (error.response) {
           if (
             error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
           ) {
           }
         }
       },
  });
};

