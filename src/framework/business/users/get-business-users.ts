import { API_ENDPOINTS } from "@/constants/endpoints";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBusinessUserById = async (input: any, business_id: any) => {
  const finalurl = `${API_ENDPOINTS.BUSINESS}/${business_id}/${API_ENDPOINTS.USERS}`;
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

export const useBusinessUserByIdQuery = (queryFilter: any) => {
  const { business } = useApplication();
  const business_id = business?._id;
  return useQuery({
    queryKey: [
      API_ENDPOINTS.BUSINESS,
      business_id,
      API_ENDPOINTS.USERS,
      queryFilter
    ],
    queryFn: () => getBusinessUserById(queryFilter, business_id),
    enabled: !!business_id,
  });
};

