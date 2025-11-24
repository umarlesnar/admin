import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getGoogleCaptchas = async (partner_id: string | string[]) => {
  const setting_keys = [
    "google_captcha",
    "google_site_secret",
    "google_site_key",
  ];

  try {
    const responses = await Promise.all(
      setting_keys?.map((key) =>
        getPartnerSettingValue(partner_id as string, key)
      )
    );
    return {
      google_captcha: responses[0]?.setting_value,
      google_site_secret: responses[1]?.setting_value,
      google_site_key: responses[2]?.setting_value,
    };
  } catch (error) {
    console.error("Error fetching Google Captcha settings:", error);
    return null;
  }
};
