import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { utc } from "moment";

export interface IBusinessPoliciesMutation {
  policy_id?: string; 
  method: "POST" | "DELETE";
  payload?: any;
}


export const BusinessPolicyMutation = (input: IBusinessPoliciesMutation) => {
  const finalUrl = `${API_ENDPOINTS.IAM}${API_ENDPOINTS.POLICIES}/${input.policy_id}/attach`;
  if (input.method === "DELETE") {
    return http.delete(finalUrl,{data:JSON.stringify({ business_id: input.payload?.business_id })});
  } else if (input.method === "POST" && input.payload) {
    return http.post(finalUrl, input.payload);
  } else {
    throw new Error("Invalid method or missing payload for POST request");
  }
};


export const useBusinessPoliciesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IBusinessPoliciesMutation) => BusinessPolicyMutation(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.IAM, API_ENDPOINTS.POLICIES, "attach"],
      });
    },
    onError: (error) => {
      console.error("Error in policies mutation:", error);
    },
  });
};
