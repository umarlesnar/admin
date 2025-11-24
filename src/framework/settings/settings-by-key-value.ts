import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getSettingByKeyValue = async (setting_key: string) => {
  const finalUrl = `${API_ENDPOINTS.SETTINGS}/${setting_key}`;

  let { data } = await http.get(finalUrl);

  return data?.data;
};

export const useSettingsByKeyValueQuery = (setting_key: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.SETTINGS, setting_key],
    queryFn: () => getSettingByKeyValue(setting_key),
  });
};
