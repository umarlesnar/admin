import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getPartnerWorkspaceById = async (partner_id: any,workspace_id: any,input: any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.WORKSPACE}/${workspace_id}/whatsapp`;
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

export const usePartnerWorkspaceById = (queryFilter: any) => {
  const { partner_id,workspace_id } = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.PARTNER,partner_id,API_ENDPOINTS.WORKSPACE,workspace_id,"whatsapp", queryFilter],
    queryFn: () => getPartnerWorkspaceById(partner_id,workspace_id,queryFilter),
  });
};
