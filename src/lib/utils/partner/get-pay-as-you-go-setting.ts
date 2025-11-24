import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerPayAsYouGoSetting = async (partner_id: string) => {

  try {
    const setting = await getPartnerSettingValue(partner_id, "pay_as_you_go");
    return {
      pay_as_you_go: {
        is_enable: setting?.setting_value?.is_enable ?? false,
        amount: setting?.setting_value?.amount ?? 0,
        tax_percentage: setting?.setting_value?.tax_percentage ?? 0,
      },
    };
  } catch (error) {
    console.error("Error fetching Pay as you go settings:", error);
    return null;
  }
};
