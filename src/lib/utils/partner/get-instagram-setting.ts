import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getInstagramSetting = async (partner_id: string ) => {
  try {
    const res = await getPartnerSettingValue(partner_id as string, "instagram");
    const instagramSettings = res?.setting_value || {};

    return {
        instagram_app_id: instagramSettings.instagram_app_id,
        instagram_client_secret: instagramSettings.instagram_client_secret,
    };
  } catch (error) {
    console.error("Error fetching instagram settings:", error);
    return null;
  }
};
