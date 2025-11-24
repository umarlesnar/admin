import { API_ENDPOINTS } from "@/constants/endpoints";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBusinessTemplateById = async (
  business_id: any,
  template_id: string,
) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}/${business_id}${API_ENDPOINTS.TEMPLATE}/${template_id}`;

  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useBusinessTemplateByIdQuery = (template_id: any) => {
  const { business } = useApplication();
  const business_id = business?._id;
  return useQuery({
    queryKey: [
      API_ENDPOINTS.BUSINESS,
      business_id,
      API_ENDPOINTS.TEMPLATE,
      template_id,
    ],
    queryFn: () => getBusinessTemplateById(business_id, template_id),
    enabled: !!business_id,
  });
};
