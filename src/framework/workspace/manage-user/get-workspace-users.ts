
import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getWorkspaceUser = async (workspace_id: any,input: any) => {
  const finalurl = `${API_ENDPOINTS.WORKSPACE}/${workspace_id}/manage-users`;
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

export const useWorkspaceUserQuery = (queryFilter: any) => {
  const { workspace_id } = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.WORKSPACE, "manage-users", workspace_id, queryFilter],
    queryFn: () => getWorkspaceUser(workspace_id, queryFilter),
  });
};