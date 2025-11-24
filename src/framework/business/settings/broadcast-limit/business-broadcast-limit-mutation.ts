import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";

function businessBroadcasrLimitMutationApi(input: any, business_id: string) {
  const finalUrl = `/business/${business_id}/settings/broadcast-limit`;
  return http.put(finalUrl, input);
}

//custom hook
export const useBusinessBroadcasrLimitUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: any) =>
      businessBroadcasrLimitMutationApi(input, business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id, "settings", "broadcast-limit"],
      });
    },
    onError: (error: any) => {
      console.error("Error Broadcast Limit update mutation:", error);
    },
  });
};
