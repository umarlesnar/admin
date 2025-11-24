import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getIndustriesById = async (Industries_id: string) => {
  const finalUrl = `${API_ENDPOINTS.INDUSTRIES}/${Industries_id}`;

  let { data } = await http.get(finalUrl);

  return data?.data;
};

export const useIndustriesByIdQuery = (Industries_id: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.INDUSTRIES, Industries_id],
    queryFn: () => getIndustriesById(Industries_id),
  });
};
