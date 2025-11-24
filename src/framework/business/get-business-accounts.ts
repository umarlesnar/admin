import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBusinessAccounts = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}`;
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

export const useBusinessAccountsQuery = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.BUSINESS, queryFilter],
    queryFn: () => getBusinessAccounts(queryFilter),
  });
};
