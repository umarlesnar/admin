import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getOnboardingUser = async (input: any) => {
  const finalurl = `${API_ENDPOINTS.DASHBOARD}${API_ENDPOINTS.RECENT}${API_ENDPOINTS.ONBOARDING_USER}`;
  const _params = {
    ...input,
  };

  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data?.data;
};

export const useOnboardingUserQuery = (queryFilter: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.DASHBOARD, API_ENDPOINTS.RECENT, API_ENDPOINTS.ONBOARDING_USER, queryFilter],
    queryFn: () => getOnboardingUser(queryFilter),
  });
};
