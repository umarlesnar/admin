import * as Yup from "yup";

export const yupHttpKeyValue = Yup.object().shape({
  name: Yup.string().required(),
  value: Yup.string().required(),
});

export const yupBusinessUpdateSchema = Yup.object().shape({
  business_profile: Yup.mixed(),
});
export const yupWhatsBusinessUpdateSchema = Yup.object().shape({
  about: Yup.string(),
  address: Yup.string(),
  description: Yup.string(),
  messaging_product: Yup.string().default("whatsapp"),
  profile_picture_url: Yup.string(),
  vertical: Yup.string(),
  websites: Yup.array().of(Yup.string()),
  profile_picture_handle: Yup.string(),
});
export const yupDisplayNameUpdateSchema = Yup.object().shape({
  display_name: Yup.string().required().min(2),
});

export const yupBusinessCloudProviderSchema = Yup.object().shape({
  cloud_provider: Yup.string().oneOf([
    "AWS_SERVERLESS",
    "SELF_HOSTING",
    "NATIVE_SERVICE",
  ]),
});

export const yupBusinessBroadcastLimitSchema = Yup.object().shape({
  per_day_limit: Yup.number().required(),
});

export const yupBusinessAccountStatusSchema = Yup.object().shape({
  status: Yup.string().oneOf(["ACTIVE", "DISABLE", "SUSPENDED", "DELETE"]),
});
