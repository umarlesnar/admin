import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerWebsocketEnpointId = async (partner_id: string | string[]) => {
  const setting_keys = ["websocket_endpoint"];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) => getPartnerSettingValue(partner_id as string,key))
    );
    return {
      websocket_endpoint: responses[0]?.setting_value,
    };
  } catch (error) {
    console.error("Error fetching websocket endpoint settings:", error);
    return null;
  }
};
