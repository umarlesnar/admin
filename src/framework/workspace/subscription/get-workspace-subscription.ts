import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getWorkspaceSubscription = async (
  queryParams: any,
  workspace_id: any
) => {
  const finalurl = `${API_ENDPOINTS.WORKSPACE}/${workspace_id}/subscription`;
  const { data } = await http.get(finalurl, {
    params: {
      ...queryParams,
      filter: JSON.stringify(queryParams.filter),
      sort: JSON.stringify(queryParams.sort),
    },
  });
  return data?.data;
};

export const useWorkspaceSubscriptionQuery = (queryParams: any) => {
  const { workspace_id } = useParams();
  return useQuery({
    queryKey: [API_ENDPOINTS.WORKSPACE, "subscription", queryParams],
    queryFn: () => getWorkspaceSubscription(queryParams, workspace_id),
  });
};
