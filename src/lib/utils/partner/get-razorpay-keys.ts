import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerRazorpayKeys = async (partner_id: string | string[]) => {
  const setting_keys = [
    "razorpay_key_id",
    "razorpay_secret_key",
    "razorpay_endpoint_key",
  ];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) => getPartnerSettingValue(partner_id as string,key))
    );
    return {
      razorpay_key_id: responses[0]?.setting_value,
      razorpay_secret_key: responses[1]?.setting_value,
      razorpay_endpoint_key: responses[2]?.setting_value,
    };
  } catch (error) {
    console.error("Error fetching Razorpay Settings settings:", error);
    return null;
  }
};
