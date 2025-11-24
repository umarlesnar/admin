import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getWorkFlowLog = async (work_flow_id: any) => {
  const finalurl = `${API_ENDPOINTS.WORK_FLOW}/${work_flow_id}/log`;
  const { data } = await http.get(finalurl);

  return data?.data;
};

export const useWorkFlowLogQuery = () => {
  const { work_flow_id } = useParams();

  return useQuery({
    queryKey: [
      API_ENDPOINTS.WORK_FLOW,
      work_flow_id,
      "log",
    ],
    queryFn: () => getWorkFlowLog(work_flow_id),
  });
};
