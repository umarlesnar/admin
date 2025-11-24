import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getWorkFlows = async (business_id: any) => {
  const finalurl = `/business/${business_id}/automate/work-flow`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useWorkFlowsQuery = (business_id: any) => {
  return useQuery({
    queryKey: ["business", business_id, "automate", "work-flow"],
    queryFn: () => getWorkFlows(business_id),
  });
};
