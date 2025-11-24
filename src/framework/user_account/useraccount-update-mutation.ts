import http from "../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface IUpdateUserAccountMutation {
  user_account_id: string;
  payload: Record<string, any>;
}

function updateUserAccount(input: IUpdateUserAccountMutation) {
  if (!input.user_account_id || !input.payload) {
    return Promise.reject(new Error("Missing required parameters"));
  }

  const finalUrl = `/user-account/${input.user_account_id}`;
  return http.put(finalUrl, input.payload);
}

export const useUserAccountUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-account"] });
    },
    onError: (error) => {
      console.error("Error updating user account:", error);
    },
  });
};
