import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBroadcasrLimitById = async (business_id: any) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}/${business_id}/settings/broadcast-limit`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useBroadcasrLimitByIdQuery = (business_id: any) => {
  return useQuery({
    queryKey: [
      API_ENDPOINTS.BUSINESS,
      business_id,
      "settings",
      "broadcast-limit",
    ],
    queryFn: () => getBroadcasrLimitById(business_id),
  });
};
