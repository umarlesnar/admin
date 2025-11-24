import { API_ENDPOINTS } from "@/constants/endpoints";
import http from "@/framework/utils/http";
import { useQuery } from "@tanstack/react-query";

const getWebbhookSubscriptionById = async (webhook_subscription_id: string) => {
  const finalurl = `${API_ENDPOINTS.WEBHOOK}/${webhook_subscription_id}`;
  const { data } = await http.get(finalurl);
  return data?.data;
};

export const useWebhookSubscriptionByIdQuery = (webhook_subscription_id: string) => {
  return useQuery({
    queryKey: [API_ENDPOINTS.WEBHOOK, webhook_subscription_id],
    queryFn: () => getWebbhookSubscriptionById(webhook_subscription_id),
  });
};
