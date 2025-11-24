import { getSettingValue } from "@/framework/settings/settings-mutation";

export const getPayAsYouGoSetting = async () => {
  const setting_keys = ["pay_as_you_go"];

  try {
    const responses = await Promise.all(
      setting_keys.map((key) => getSettingValue(key))
    );
    return {
      // pay_as_you_go: responses[0]?.setting_value?.is_enable,
      pay_as_you_go: {
        is_enable: responses[0]?.setting_value?.is_enable,
        amount: responses[1]?.setting_value?.amount,
        tax_percentage: responses[2]?.setting_value?.tax_percentage,
      },
    };
  } catch (error) {
    console.error("Error fetching Pay as you go settings:", error);
    return null;
  }
};
