import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";


const getTransaction = async (partner_id:any,workspace_id:any,input: any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.WORKSPACE}/${workspace_id}/transaction`;
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

export const useTransactionQuery = (queryFilter: any) => {
   const { workspace_id,partner_id} = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.WORKSPACE, workspace_id,"transaction",  queryFilter],
    queryFn: () => getTransaction(partner_id,workspace_id,queryFilter),
  });
};


