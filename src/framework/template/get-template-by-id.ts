import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getTemplatebById = async (template_id: string) => {
  const finalurl = `${API_ENDPOINTS.TEMPLATE}${API_ENDPOINTS.LIBRARY}/${template_id}`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useTemplateByIdQuery = (template_id: string) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.TEMPLATE, API_ENDPOINTS.LIBRARY, template_id],
    queryFn: () => getTemplatebById(template_id),
  });
};
