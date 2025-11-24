import { API_ENDPOINTS } from "@/constants/endpoints";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const getWorkFlowById = async (work_flow_id: any) => {
  const finalurl = `${API_ENDPOINTS.WORK_FLOW}/${work_flow_id}`;
  const { data } = await http.get(finalurl);

  return data?.data;
};

export const useWorkFlowByIdQuery = () => {
  const { work_flow_id } = useParams();

  return useQuery({
    queryKey: [
      API_ENDPOINTS.WORK_FLOW,
      work_flow_id,
    ],
    queryFn: () => getWorkFlowById(work_flow_id)
  });
};
