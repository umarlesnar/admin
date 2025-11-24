import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export default interface IModulesMutation {
  modules_id?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export const ModulesMutation = (input: IModulesMutation) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl =
      `${API_ENDPOINTS.MODULES}` + `/${input.modules_id}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.MODULES}`;
    return http.post(finalUrl, input.payload);
  }
};

export const useMasterModulesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IModulesMutation) =>
        ModulesMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.MODULES],
      });
    },
    onError: (error) => {
      console.error("Error Modules mutation:", error);
    },
  });
};
