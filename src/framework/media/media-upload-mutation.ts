import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import axios from "axios";

async function mediaUploadApi(input: any) {
  const finalUrl = `${API_ENDPOINTS.MEDIA}${API_ENDPOINTS.UPLOAD}`;
  //@ts-ignore
  const { data } = await http.post(finalUrl, {
    name: input?.payload?.name,
    type: input.payload.type,
    content_type: input.payload.type,
    size: input.payload.size,
    file_path_type: input.file_path_type,
  });

  await axios.put(data.upload_url, input.payload, {
    headers: { "Content-type": input.payload.type },
  });

  return {
    file_name: data.file_name,
    file_path: data.file_path,
    public_url: data.public_url,
    id: data.media_id,
  };
}

//custom hook
export const useMediaUploadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: any) => mediaUploadApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MEDIA, API_ENDPOINTS.UPLOAD],
      });
    },
    onError: (error: any) => {
      console.error("Error media upload mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
