import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { useParams } from "next/navigation";

export default interface IIamPoliciesMutation {
  partner_id?: any;
  policy_id?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}


export const IamPoliciesMutation = (input: IIamPoliciesMutation) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl =
      `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.POLICIES}` + `/${input.policy_id}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}${API_ENDPOINTS.POLICIES}`;
    return http.post(finalUrl, input.payload);
  }
};

export const useIamPoliciesMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();

  return useMutation({
    mutationFn: (input:Omit<IIamPoliciesMutation, "partner_id">) => IamPoliciesMutation({...input,partner_id}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER,partner_id,API_ENDPOINTS.POLICIES],
      });
    },
    onError: (error) => {
      console.error("Error policies mutation:", error);
    },
  });
};
