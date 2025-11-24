import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";

interface IProductMutation {
  partner_id?: string;
  settings_key?: string;
  method?: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export function PartnerMutationApi(input: IProductMutation) {
  if (input.method === "DELETE") {
    const finalUrl = input.settings_key
      ? `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.SETTINGS}/${input.settings_key}`
      : `${API_ENDPOINTS.PARTNER}/${input.partner_id}`;
    return http.delete(finalUrl);
  }

  if (input.method === "PUT") {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.SETTINGS}/${input.settings_key}`;
    return http.put(finalUrl, input.payload);
  }

  return http.post(API_ENDPOINTS.PARTNER, input.payload);
}

export const getPartnerSettingValue = async (
  partner_id: string,
  settings_key: string
) => {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.SETTINGS}/${settings_key}`;
  let { data } = await http.get(finalUrl);
  return data?.data;
};

export const usePartnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IProductMutation) => PartnerMutationApi(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER],
      });
    },

    onError: (error: any) => {
      console.error("Error Partner mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
