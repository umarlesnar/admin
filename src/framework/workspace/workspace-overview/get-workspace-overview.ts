import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getWorkspaceOverview = async (workspace_id: string) => {
  const finalurl = `${API_ENDPOINTS.WORKSPACE}/${workspace_id}/workspace-overview`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useWorkspaceOverviewQuery = (workspace_id: string) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.WORKSPACE, workspace_id, "workspace-overview"],
    queryFn: () => getWorkspaceOverview(workspace_id),
  });
};

