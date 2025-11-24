import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getAddon = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.ADDON}`;
  const _params = {
    ...input,
    sort: JSON.stringify(input.sort),
    filter: JSON.stringify(input.filter),
  };
  
  if (_params.q) {
    _params.query = _params.q;
    delete _params.q;
  }

  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data?.data;
};

export const useAddonQuery = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.ADDON, queryFilter],
    queryFn: () => getAddon(queryFilter),
  });
};
