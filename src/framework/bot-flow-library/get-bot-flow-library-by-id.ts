import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBotFlowLibraryById = async (flow_id: string) => {
  const finalUrl = `${API_ENDPOINTS.FLOW}${API_ENDPOINTS.LIBRARY}/${flow_id}`;

  let { data } = await http.get(finalUrl);

  return data?.data;
};

export const useBotFlowLibraryByIdQuery = (flow_id: any) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.FLOW, API_ENDPOINTS.LIBRARY, flow_id],
    queryFn: () => getBotFlowLibraryById(flow_id),
  });
};
