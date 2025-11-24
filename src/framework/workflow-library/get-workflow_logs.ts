import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getWorkFlowLogs = async (
  input: any,
  work_flow_id: any,
) => {
  const finalurl = `${API_ENDPOINTS.WORK_FLOW}/${work_flow_id}/logs`;

  const _params = {
    ...input,
    filter: JSON.stringify(input.filter),
    sort: JSON.stringify(input.sort),
  };
  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data;
};

export const useWorkFlowLogsQuery = (input: any) => {
  const { work_flow_id } = useParams();

  return useQuery({
    queryKey: [
      API_ENDPOINTS.WORK_FLOW,
      work_flow_id,
      "logs",
      input,
    ],
    queryFn: () => getWorkFlowLogs(input, work_flow_id),
  });
};
