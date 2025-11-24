import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getAccountStatusById = async (business_id: any) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}/${business_id}/settings/account-status`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useAccountStatusByIdQuery = (business_id: any) => {
  return useQuery({
    queryKey: [
      API_ENDPOINTS.BUSINESS,
      business_id,
      "settings",
      "account-status",
    ],
    queryFn: () => getAccountStatusById(business_id),
  });
};
