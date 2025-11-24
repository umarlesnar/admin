import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export default interface ISystemRoleMutation {
  system_roles_id?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}


export const SystemRolesMutation = (input: ISystemRoleMutation) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl =
      `${API_ENDPOINTS.IAM}/system-roles` + `/${input.system_roles_id}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.IAM}/system-roles`;
    return http.post(finalUrl, input.payload);
  }
};

export const useSystemRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ISystemRoleMutation) => SystemRolesMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.IAM,"system-roles"],
      });
    },
    onError: (error) => {
      console.error("Error System Role mutation:", error);
    },
  });
};
