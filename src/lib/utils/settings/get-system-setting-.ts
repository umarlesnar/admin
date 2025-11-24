import { getSettingValue } from "@/framework/settings/settings-mutation";

export const getSystemSetting = async () => {
  const setting_keys = ["system_token"];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) => getSettingValue(key))
    );
    return {
      system_token: responses[0]?.setting_value?.token_data,
    };
  } catch (error) {
    console.error("Error fetching System settings:", error);
    return null;
  }
};
