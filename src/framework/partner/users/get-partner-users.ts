import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getPartnerUsers = async (partner_id: any,input: any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.USERS}`;
  const _params = {
    ...input,
    sort: JSON.stringify(input.sort),
    filter: JSON.stringify(input.filter),
  };

  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data?.data;
};

export const usePartnerUsers = (queryFilter: any) => {
  const { partner_id } = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.PARTNER,partner_id,API_ENDPOINTS.USERS, queryFilter],
    queryFn: () => getPartnerUsers(partner_id,queryFilter),
  });
};
