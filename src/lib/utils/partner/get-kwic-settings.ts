import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerKwicSetting = async (partner_id: string) => {
  try {
    const res = await getPartnerSettingValue(partner_id as string, "kwic");
    const kwicSettings = res?.setting_value || {};

    console.log("kwicSettings", partner_id, kwicSettings);

    return {
      workflow_url: kwicSettings.workflow_url,
    };
  } catch (error) {
    console.error("Error fetching kwic settings:", error);
    return null;
  }
};
