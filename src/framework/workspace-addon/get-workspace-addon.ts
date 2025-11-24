import { API_ENDPOINTS } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import http from "../utils/http";

const getWorkspaceAddon = async (input: any,partner_id:any) => {
  const finalurl = `${API_ENDPOINTS.PARTNER}/${partner_id}/${API_ENDPOINTS.WORKSPACE_ADDON}`;
  
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

export const useWorkspaceAddonQuery = (queryFilter: any) => {
  const { partner_id } = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.PARTNER, partner_id, API_ENDPOINTS.WORKSPACE_ADDON, queryFilter],
    queryFn: () => getWorkspaceAddon(queryFilter,partner_id),
  });
};

