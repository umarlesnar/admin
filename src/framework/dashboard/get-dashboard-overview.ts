import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getOverview = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.DASHBOARD}${API_ENDPOINTS.OVERVIEW}`;
  const _params = {
    ...input,
  };

  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data?.data;
};

export const useOverviewQuery = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.DASHBOARD,API_ENDPOINTS.OVERVIEW, queryFilter],
    queryFn: () => getOverview(queryFilter),
  });
};
