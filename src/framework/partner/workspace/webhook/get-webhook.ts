import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";


const getWebhook = async (partner_id:any,workspace_id:any,input: any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.WORKSPACE}/${workspace_id}/webhook`;
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

export const useWebhookQuery = (queryFilter: any) => {
   const { workspace_id,partner_id} = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.WORKSPACE, workspace_id,"webhook",  queryFilter],
    queryFn: () => getWebhook(partner_id,workspace_id,queryFilter),
  });
};


