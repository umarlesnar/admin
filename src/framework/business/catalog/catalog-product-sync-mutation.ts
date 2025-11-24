import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_STATUS_CODE } from "@/lib/utils/common";
import { useApplication } from "@/contexts/application/application.context";
import http from "@/framework/utils/http";

function CatatlogProductSyncApi(business_id: string) {
  const finalUrl = `/business/${business_id}${API_ENDPOINTS.CATALOG}/product/sync`;
  return http.put(finalUrl, {});
}

//custom hook
export const useCatalogProductSyncMutation = () => {
  const queryClient = useQueryClient();
  const { business } = useApplication();
  const business_id = business?._id;

  return useMutation({
    mutationFn: () => CatatlogProductSyncApi(business_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business", business_id, API_ENDPOINTS.CATALOG, "product"],
      });
    },
    onError: (error: any) => {
      console.error("Error Catalog Product Sync mutation:", error);
      if (error.response) {
        if (
          error.response.status === SERVER_STATUS_CODE.UNAUTHORIZED_ACCESS_CODE
        ) {
        }
      }
    },
  });
};
