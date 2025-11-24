import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getPartnerProductPolicy = async (partner_id: any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.PRODUCT}/policy`;


  const { data } = await http.get(finalurl);

  return data?.data;
};

export const usePartnerProductPolicyQuery = () => {
  const { partner_id } = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.PRODUCT],
    queryFn: () => getPartnerProductPolicy(partner_id),
  });
};
