import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBusinessById = async (business_id: any) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}/${business_id}`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useBusinessByIdQuery = (business_id: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.BUSINESS, business_id],
    queryFn: () => getBusinessById(business_id),
  });
};
