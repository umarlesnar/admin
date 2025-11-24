import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useParams } from "next/navigation";

interface IPartnerProductMutation {
    partner_id?: any;
  product_id?: any;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function PartnerProductMutationApi(input: IPartnerProductMutation) {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.PRODUCT}/${input.product_id}`;

    if (input.method == "DELETE") {
      return http.delete(finalUrl);
    } else {
      return http.put(finalUrl, input.payload);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.PRODUCT}`;
    return http.post(finalUrl, input.payload);
  }
}

//custom hook
export const usePartnerProductMutation = () => {
  const queryClient = useQueryClient();
   const { partner_id } = useParams();

  return useMutation({
    mutationFn: (input:  Omit<IPartnerProductMutation, "partner_id">) => PartnerProductMutationApi({...input,partner_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ API_ENDPOINTS.PARTNER,partner_id,API_ENDPOINTS.PRODUCT],
      });
    },
    onError: (error: any) => {
      console.error("Error Partner Product mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
