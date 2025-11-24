import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getBroadcsts = async (input: any, business_id: any) => {
  const finalurl = `/business/${business_id}/broadcast`;
  const _params = {
    ...input,
  };

  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data;
};

export const useBroadcastQuery = (queryFilter: any) => {
  const { business } = useApplication();
  const business_id = business?._id;

  return useQuery({
    queryKey: ["business", business_id, "broadcast", queryFilter],
    queryFn: () => getBroadcsts(queryFilter, business_id),
    enabled: !!business_id,
  });
};
