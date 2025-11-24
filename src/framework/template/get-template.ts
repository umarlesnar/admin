import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getTemplate = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.TEMPLATE}${API_ENDPOINTS.LIBRARY}`;
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

export const useTemplateQuery = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.TEMPLATE, API_ENDPOINTS.LIBRARY, queryFilter],
    queryFn: () => getTemplate(queryFilter),
  });
};
