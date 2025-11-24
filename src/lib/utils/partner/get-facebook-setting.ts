import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getFacebookSetting = async (partner_id: string) => {
  try {
    const res = await getPartnerSettingValue(partner_id as string, "facebook");
    const facebookSettings = res?.setting_value || {};

    return {
      facebook_app_id: facebookSettings.facebook_app_id,
      facebook_business_id: facebookSettings.facebook_business_id,
      facebook_client_secret: facebookSettings.facebook_client_secret,
      facebook_sdk_url: facebookSettings.facebook_sdk_url,
      facebook_sdk_version: facebookSettings.facebook_sdk_version,
    };
  } catch (error) {
    console.error("Error fetching whatsapp settings:", error);
    return null;
  }
};
