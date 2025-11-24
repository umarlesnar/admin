import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";
import { utc } from "moment";
import { useParams } from "next/navigation";

export interface IIamBusinessPoliciesMutation {
  partner_id?:any;
  policy_id?: string; 
  method: "POST" | "DELETE";
  payload?: any;
}


export const IamBusinessPolicyMutation = (input: IIamBusinessPoliciesMutation) => {
  const finalUrl = `${API_ENDPOINTS.PARTNER}/${input.partner_id}/${API_ENDPOINTS.POLICIES}/${input.policy_id}/attach`;
  if (input.method === "DELETE") {
    return http.delete(finalUrl,{data:JSON.stringify({ business_id: input.payload?.business_id })});
  } else if (input.method === "POST" && input.payload) {
    return http.post(finalUrl, input.payload);
  } else {
    throw new Error("Invalid method or missing payload for POST request");
  }
};


export const useIamBusinessPoliciesMutation = () => {
  const queryClient = useQueryClient();
  const { partner_id } = useParams();
  return useMutation({
    mutationFn: (input: Omit<IIamBusinessPoliciesMutation, "partner_id">) => IamBusinessPolicyMutation({...input,partner_id}),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PARTNER,partner_id,API_ENDPOINTS.POLICIES, "attach"],
      });
    },
    onError: (error) => {
      console.error("Error in policies mutation:", error);
    },
  });
};
