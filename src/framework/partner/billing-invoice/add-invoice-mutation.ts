import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const addInvoice = async (partner_id: any, payload: any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}/billing-invoice`;

  const { data } = await http.post(finalurl, payload);

  return data?.data;
};

export const useAddInvoiceMutation = () => {
  const { partner_id } = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => addInvoice(partner_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER, partner_id, "billing-invoice"],
      });
    },
  });
};
