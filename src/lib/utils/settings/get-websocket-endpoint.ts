import { getSettingValue } from "@/framework/settings/settings-mutation";

export const getWebsocketEnpointId = async () => {
  const setting_keys = ["websocket_endpoint"];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) => getSettingValue(key))
    );
    return {
      websocket_endpoint: responses[0]?.setting_value,
    };
  } catch (error) {
    console.error("Error fetching websocket endpoint settings:", error);
    return null;
  }
};
