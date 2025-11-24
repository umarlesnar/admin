import { API_ENDPOINTS } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/framework/utils/http";

export default interface ISettingsMutation {
  setting_key?: any;
  method: "POST" | "PUT" | "DELETE";
  payload?: any;
}

export const SettingsMutation = (input: ISettingsMutation) => {
  if (input.method == "PUT" || input.method == "DELETE") {
    const finalUrl = `${API_ENDPOINTS.SETTINGS}` + `/${input.setting_key}`;
    if (input.method == "PUT") {
      return http.put(finalUrl, input.payload);
    } else {
      return http.delete(finalUrl);
    }
  } else {
    const finalUrl = `${API_ENDPOINTS.SETTINGS}`;
    return http.post(finalUrl, input.payload);
  }
};

export const getSettingValue = async (setting_key: any) => {
  const finalUrl = `${API_ENDPOINTS.SETTINGS}/${setting_key}`;
  let { data } = await http.get(finalUrl);
  return data?.data;
};

export const useSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ISettingsMutation) => SettingsMutation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.SETTINGS],
      });
    },
    onError: (error) => {
      console.error("Error Settings mutation:", error);
    },
  });
};
