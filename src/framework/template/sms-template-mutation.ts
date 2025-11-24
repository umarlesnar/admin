import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";

interface ITemplateMutation {
  template_id: string;
  paylaod: {
    template_id: string;
    body: string;
  };
}

export function smsTemplateMutationApi(
  input: ITemplateMutation,
  business_id: string
) {
  const finalUrl = `/business/${business_id}${API_ENDPOINTS.TEMPLATE}/${input.template_id}/sms`;
  return http.put(finalUrl, input?.paylaod);
}

//custom hook
export const useSmsTemplateMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: ITemplateMutation) =>
      smsTemplateMutationApi(input, business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id, API_ENDPOINTS.TEMPLATE],
      });
    },
    onError: (error: any) => {
      console.error("Error template mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
