import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getIamPolicyById = async (partner_id: any,policy_id: string) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}${API_ENDPOINTS.POLICIES}/${policy_id}/attach`;
 
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useIamPolicyByIdQuery = (policy_id: string) => {
  const { partner_id } = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.PARTNER, partner_id , API_ENDPOINTS.POLICIES, policy_id,"attach"],
    queryFn: () => getIamPolicyById(partner_id,policy_id),
  });
};
