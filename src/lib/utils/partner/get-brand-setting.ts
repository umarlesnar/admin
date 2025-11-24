import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getBrandSetting = async (partner_id: string) => {
  try {
    const res = await getPartnerSettingValue(partner_id as string, "brand");
    const brandSettings = res?.setting_value || {};

    return {
      name: brandSettings.name,
      logo_with_name: brandSettings.logo_with_name,
      logo_with_name2: brandSettings.logo_with_name2,
      contact_email: brandSettings.contact_email,
      logo: brandSettings.logo,
      dark: brandSettings.dark,
      light: brandSettings.light,
      primary: brandSettings.primary,
      primary_50: brandSettings.primary_50,
      primary_100: brandSettings.primary_100,
      primary_200: brandSettings.primary_200,
      primary_300: brandSettings.primary_300,
      primary_400: brandSettings.primary_400,
      primary_500: brandSettings.primary_500,
      primary_600: brandSettings.primary_600,
      primary_700: brandSettings.primary_700,
      primary_800: brandSettings.primary_800,
      primary_900: brandSettings.primary_900,
    };
  } catch (error) {
    console.error("Error fetching Brand settings:", error);
    return null;
  }
};
