import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerEmailSetting = async (partner_id: string) => {
  try {
    const res = await getPartnerSettingValue(
      partner_id as string,
      "smtp_config"
    );
    const emailSettings = res?.setting_value || {};

    return {
      smtp_username: emailSettings.smtp_username,
      smtp_password: emailSettings.smtp_password,
      smtp_host: emailSettings.smtp_host,
      smtp_port: emailSettings.smtp_port,
      smtp_from: emailSettings.smtp_from,
      smtp_secure: emailSettings.smtp_secure,
      smtp_ignore_tls: emailSettings.smtp_ignore_tls,
      smtp_auth_disabled: emailSettings.smtp_auth_disabled,
    };
  } catch (error) {
    console.error("Error fetching whatsapp settings:", error);
    return null;
  }
};
