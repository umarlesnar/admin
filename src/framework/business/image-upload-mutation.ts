import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";

export function ImageUploadApi(input: any, business_id: string) {
  const finalUrl = `/business/${business_id}/whatsapp/uploads`;
  return http.post(finalUrl, input, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
}

//custom hook
export const useImageUploadMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: (input: any) => ImageUploadApi(input, business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id, "whatsapp", "uploads"],
      });
    },
    onError: (error: any) => {
      console.error("Error operator mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
