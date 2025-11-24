import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getProductPolicy = async () => {
  const finalurl = `${API_ENDPOINTS.PRODUCT}/policy`;

  const { data } = await http.get(finalurl);

  return data?.data;
};

export const useProductPolicyQuery = () => {
  return useQuery({
    queryKey: [API_ENDPOINTS.PRODUCT],
    queryFn: () => getProductPolicy(),
  });
};
