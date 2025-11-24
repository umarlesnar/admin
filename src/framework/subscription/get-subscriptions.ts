import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getSubscriptions = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.SUBSCRIPTION}`;
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

export const useSubscriptionQuery = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUBSCRIPTION, queryFilter],
    queryFn: () => getSubscriptions(queryFilter),
  });
};
