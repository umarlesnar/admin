import http from "@/framework/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";

function businessRegistrationMutationApi(business_id: string) {
  const finalUrl = `/business/${business_id}/whatsapp/register`;
  return http.put(finalUrl);
}

export const useBusinessRegisterUpdateMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: () => businessRegistrationMutationApi(business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id, "whatsapp", "register"],
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["me"],
      // });
    },
    onError: (error: any) => {
      console.error("Error business register update mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
