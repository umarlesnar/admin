import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getUsecaseApi = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.USECASE}`;
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

export const useUsecaseApi = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.USECASE, queryFilter],
    queryFn: () => getUsecaseApi(queryFilter),
  });
};
