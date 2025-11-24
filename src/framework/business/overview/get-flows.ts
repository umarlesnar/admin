import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getFlows = async (business_id: any) => {
  const finalUrl = `/business/${business_id}/automate/flow`;

  let { data } = await http.get(finalUrl);

  return data;
};

export const useFlowQuery = (business_id: any) => {
  return useQuery({
    queryKey: ["business", business_id, "automate", "flow"],
    queryFn: () => getFlows(business_id),
    enabled: !!business_id,
  });
};
