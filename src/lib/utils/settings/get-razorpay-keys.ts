import { getSettingValue } from "@/framework/settings/settings-mutation";

export const getRazorpayKeys = async () => {
  const setting_keys = [
    "razorpay_key_id",
    "razorpay_secret_key",
    "razorpay_endpoint_key",
  ];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) => getSettingValue(key))
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
