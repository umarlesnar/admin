import { getSettingValue } from "@/framework/settings/settings-mutation";

export const getGoogleCaptcha = async () => {
  const setting_keys = [
    "google_captcha",
    "google_site_secret",
    "google_site_key",
    "google_auth",
  ];

  try {
    const responses = await Promise.all(
      setting_keys?.map((key) => getSettingValue(key))
    );
    return {
      google_captcha: responses[0]?.setting_value,
      google_site_secret: responses[1]?.setting_value,
      google_site_key: responses[2]?.setting_value,
      google_auth: responses[3]?.setting_value,
    };
  } catch (error) {
    console.error("Error fetching Google Captcha settings:", error);
    return null;
  }
};
