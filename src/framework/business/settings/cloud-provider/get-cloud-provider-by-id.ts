import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getCloudProviderById = async (business_id: any) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}/${business_id}/settings/cloud-provider`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useCloudProviderByIdQuery = (business_id: any) => {
  return useQuery({
    queryKey: [
      API_ENDPOINTS.BUSINESS,
      business_id,
      "settings",
      "cloud-provider",
    ],
    queryFn: () => getCloudProviderById(business_id),
  });
};
