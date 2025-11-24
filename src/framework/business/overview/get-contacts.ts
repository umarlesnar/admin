import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getContacts = async (input: any, business_id: any) => {
  const finalurl = `/business/${business_id}/contact`;
  const _params = {
    ...input,
  };

  const { data } = await http.get(finalurl, {
    params: _params,
  });

  return data?.data;
};

export const useContactQuery = (queryFilter: any) => {
  const { business } = useApplication();
  const business_id = business?._id;

  return useQuery({
    queryKey: ["business", business_id, "contact", queryFilter],
    queryFn: () => getContacts(queryFilter, business_id),
    enabled: !!business_id,
  });
};
