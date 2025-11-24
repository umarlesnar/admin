import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getPolicyById = async (policy_id: string) => {
  const finalurl = `${API_ENDPOINTS.IAM}${API_ENDPOINTS.POLICIES}/${policy_id}/attach`;
 
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const usePolicyByIdQuery = (policy_id: string) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.IAM, API_ENDPOINTS.POLICIES, policy_id,"attach"],
    queryFn: () => getPolicyById(policy_id),
  });
};
