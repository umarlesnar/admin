import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getWorkFlows = async (input: any) => {
  const _params = {
    ...input,
    filter: JSON.stringify(input.filter),
  };
  const finalurl = `${API_ENDPOINTS.WORK_FLOW}`;
  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data;
};

export const useWorkFlowsQuery = (queryFilter: any) => {

  return useQuery({
    queryKey: [
      API_ENDPOINTS.WORK_FLOW,
      queryFilter,
    ],
    queryFn: () => getWorkFlows(queryFilter)
  });
};
