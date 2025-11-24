import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getClientAuthUserById = async (user_id: string) => {
  const finalurl = `${API_ENDPOINTS.IAM}${API_ENDPOINTS.USERS}/${user_id}/client-auth`;
 
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useClientAuthUserByIdQuery = (user_id: string) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.IAM, API_ENDPOINTS.USERS, user_id, "client-auth"],
    queryFn: () => getClientAuthUserById(user_id),
  });
};
