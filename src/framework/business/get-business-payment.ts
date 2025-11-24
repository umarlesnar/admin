import { API_ENDPOINTS } from "@/constants/endpoints";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBusinessPaymentById = async (input: any,business_id: string) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}/${business_id}/${API_ENDPOINTS.PAYMENT}`;
  const _params = {
    ...input,
    sort: JSON.stringify(input.sort),
    filter: JSON.stringify(input.filter),
  };
  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data?.data;
};

export const useBusinessPaymentByIdQuery = (queryFilter: any) => {
  const { business } = useApplication();
    const business_id = business?._id;
  return useQuery({
    queryKey: [API_ENDPOINTS.BUSINESS, business_id, API_ENDPOINTS.PAYMENT, queryFilter],
    queryFn: () => getBusinessPaymentById(queryFilter, business_id),
    enabled: !!business_id,
  });
};
