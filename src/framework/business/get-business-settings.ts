import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBusinessSettingsById = async (business_id: string) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}/${business_id}/${API_ENDPOINTS.SETTINGS}`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useBusinessSettingsByIdQuery = (business_id: string) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.BUSINESS, business_id, API_ENDPOINTS.SETTINGS],
    queryFn: () => getBusinessSettingsById(business_id),
  });
};
