import { getSettingValue } from "@/framework/settings/settings-mutation";

export const getFacebookAppId = async () => {
  const setting_keys = ["facebook_app_id"];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) => getSettingValue(key))
    );
    return {
      facebook_app_id: responses[0]?.setting_value,
    };
  } catch (error) {
    console.error("Error fetching facebook app id settings:", error);
    return null;
  }
};
