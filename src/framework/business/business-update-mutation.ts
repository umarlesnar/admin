import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";

function businessMutationApi(input: any, business_id: string) {
  const finalUrl = `/business/${business_id}`;
  return http.put(finalUrl, input);
}

//custom hook
export const useBusinessUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: any) => businessMutationApi(input, business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
    onError: (error: any) => {
      console.error("Error business update mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
