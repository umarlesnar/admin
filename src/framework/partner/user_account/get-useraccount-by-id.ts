import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getUserAccountById = async (user_account_id: string) => {
  const finalurl = `${API_ENDPOINTS.USERACCOUNT}/${user_account_id}`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useUserAccountByIdQuery = (user_account_id: string) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.USERACCOUNT, user_account_id],
    queryFn: () => getUserAccountById(user_account_id),
  });
};
