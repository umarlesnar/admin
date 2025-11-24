import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerSystemSetting = async (partner_id: string) => {
  const setting_keys = ["system_token"];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) =>
        getPartnerSettingValue(partner_id as string, key)
      )
    );
    return {
      system_token: responses[0]?.setting_value || "",
    };
  } catch (error) {
    console.error("Error fetching System settings:", error);
    return null;
  }
};
