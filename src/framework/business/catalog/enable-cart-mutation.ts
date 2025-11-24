import { useMutation } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";

function cartEnbleApi(input: any, business_id: string) {
  const finalUrl = `/business/${business_id}/catalog/cart`;
  return http.put(finalUrl, input);
}

//custom hook
export const useCartEnableMutation = () => {
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: any) => cartEnbleApi(input, business_id),
    onSuccess: () => {},
    onError: (error: any) => {
      console.error("Error Cart Enable mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
