import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getSettings = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.SETTINGS}`;
  const _params = {
    ...input,
  };

  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data?.data;
};

export const useSettingsApi = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.SETTINGS, queryFilter],
    queryFn: () => getSettings(queryFilter),
  });
};
