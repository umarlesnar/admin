import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getPartnerById = async (partner_id: any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const usePartnerByIdQuery = (partner_id: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.WORKSPACE, partner_id],
    queryFn: () => getPartnerById(partner_id),
  });
};
