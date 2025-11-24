import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getGoogleAuthSetting = async (partner_id: string) => {
  try {
    const res = await getPartnerSettingValue(
      partner_id as string,
      "google_auth"
    );
    const whatsappSettings = res?.setting_value || {};

    return {
      client_id: whatsappSettings.client_id,
      client_secret: whatsappSettings.client_secret,
    };
  } catch (error) {
    console.error("Error fetching whatsapp settings:", error);
    return null;
  }
};
