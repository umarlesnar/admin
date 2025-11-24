import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getPartnerWorkspaceUsers = async (partner_id: any,user_id: any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.USERS}/${user_id}/${API_ENDPOINTS.WORKSPACE}`;
 
  const { data } = await http.get(finalurl);

  return data?.data;
};

export const usePartnerWorkspaceUsers = ( user_id:any) => {
  const { partner_id } = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.PARTNER,partner_id,API_ENDPOINTS.USERS,user_id,API_ENDPOINTS.WORKSPACE],
    queryFn: () => getPartnerWorkspaceUsers(partner_id,user_id),
    enabled: !!user_id,
  });
};
