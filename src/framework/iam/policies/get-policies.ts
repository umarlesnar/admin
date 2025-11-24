import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getPolicies = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.IAM}${API_ENDPOINTS.POLICIES}`;
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

export const usePoliciesApi = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.IAM,API_ENDPOINTS.POLICIES, queryFilter],
    queryFn: () => getPolicies(queryFilter),
  });
};
