import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerPaymentSetting = async (partner_id: string | string[]) => {
  const setting_keys = [
    "new_registration_subscription",
    "discount_percentage_yearly",
  ];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) => getPartnerSettingValue(partner_id as string,key))
    );
    return {
      new_registration_subscription: responses[0]?.setting_value,
      discount_percentage_yearly: responses[1]?.setting_value,
    };
  } catch (error) {
    console.error("Error fetching Payment settings:", error);
    return null;
  }
};
