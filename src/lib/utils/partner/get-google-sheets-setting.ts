import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerGoogleSheetsSetting = async (partner_id: string) => {
  try {
    const res = await getPartnerSettingValue(
      partner_id as string,
      "google_sheet"
    );
    const googleSheetsSettings = res?.setting_value || {};

    return {
      google_sheets_client_id: googleSheetsSettings.google_sheets_client_id,
      google_sheets_client_secret:
        googleSheetsSettings.google_sheets_client_secret,
      google_sheets_api_key: googleSheetsSettings.google_sheets_api_key,
    };
  } catch (error) {
    console.error("Error fetching whatsapp settings:", error);
    return null;
  }
};
