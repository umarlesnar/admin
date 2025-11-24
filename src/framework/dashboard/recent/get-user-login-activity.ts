import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getUserLoginActivity = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.DASHBOARD}${API_ENDPOINTS.RECENT}${API_ENDPOINTS.USER_LOGIN}`;
  const _params = {
    ...input,
  };

  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data?.data;
};

export const useUserLoginQuery = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.DASHBOARD,API_ENDPOINTS.RECENT,API_ENDPOINTS.USER_LOGIN, queryFilter],
    queryFn: () => getUserLoginActivity(queryFilter),
  });
};
