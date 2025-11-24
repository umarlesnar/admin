import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getInstallationApps = async (business_id: any) => {
  const finalurl = `/business/${business_id}/integration`;

  const { data } = await http.get(finalurl);

  return data?.data;
};

export const useInstallationAppsQuery = () => {
  const { business } = useApplication();
  const business_id = business?._id;

  return useQuery({
    queryKey: ["business", business_id, "integration"],
    queryFn: () => getInstallationApps(business_id),
    enabled: !!business_id,
  });
};
