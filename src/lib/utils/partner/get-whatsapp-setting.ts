import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerWhatsappSetting = async (partner_id: string ) => {
  try {
    const res = await getPartnerSettingValue(partner_id as string, "whatsapp");
    const whatsappSettings = res?.setting_value || {};

    return {
      token: whatsappSettings.token,
      url: whatsappSettings.url,
      config_id: whatsappSettings.config_id,
    };
  } catch (error) {
    console.error("Error fetching whatsapp settings:", error);
    return null;
  }
};
