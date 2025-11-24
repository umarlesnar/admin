import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";

function businessCloudProviderMutationApi(input: any, business_id: string) {
  const finalUrl = `/business/${business_id}/settings/cloud-provider`;
  return http.put(finalUrl, input);
}

//custom hook
export const useBusinessCloudProviderUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: any) =>
      businessCloudProviderMutationApi(input, business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id, "settings", "cloud-provider"],
      });
    },
    onError: (error: any) => {
      console.error("Error CLoud provider update mutation:", error);
    },
  });
};
