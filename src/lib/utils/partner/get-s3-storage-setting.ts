import { getPartnerSettingValue } from "@/framework/partner/partner-mutation";

export const getPartnerS3StorageSetting = async (partner_id: string) => {
  try {
    const res = await getPartnerSettingValue(
      partner_id as string,
      "s3_storage"
    );
    const s3StorageSettings = res?.setting_value || {};

    return {
      s3_access_key: s3StorageSettings.s3_access_key,
      s3_secret_key: s3StorageSettings.s3_secret_key,
      s3_bucket: s3StorageSettings.s3_bucket,
      s3_port: s3StorageSettings.s3_port,
      s3_endpoint: s3StorageSettings.s3_endpoint,
      s3_ssl: s3StorageSettings.s3_ssl,
      s3_region: s3StorageSettings.s3_region,
      s3_public_custom_domain: s3StorageSettings.s3_public_custom_domain,
    };
  } catch (error) {
    console.error("Error fetching whatsapp settings:", error);
    return null;
  }
};
