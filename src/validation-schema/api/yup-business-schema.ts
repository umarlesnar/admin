import * as Yup from "yup";

export const yupBusinessSortQuery = Yup.object().shape({
  name: Yup.number().oneOf([1, -1]).default(1),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
});

export const yupBusinessAccountSchema = Yup.object().shape({
  display_name: Yup.string().required(),
  display_name_status: Yup.string().required(),
  img_repo_id: Yup.string().nullable(),
  name: Yup.string().required(),
  business_logo_url: Yup.string().url().nullable(),
  user_id: Yup.string()
    .matches(/^[a-f\d]{24}$/i, "Invalid ObjectId")
    .nullable(),
  fb_app_id: Yup.string().required(),
  wba_id: Yup.string().required(),
  phone_number_id: Yup.string().required(),
  type: Yup.string().oneOf(["CLOUD API", "OTHER TYPE"]).default("CLOUD API"),
  business_profile: Yup.mixed().nullable(),
  fb_namespace: Yup.string().nullable(),
  sms: Yup.mixed().nullable(),
  access_token: Yup.string().required(),
  status: Yup.string()
    .oneOf(["ACTIVE", "INACTIVE", "SUSPENDED"])
    .default("ACTIVE"),
  default_bot: Yup.mixed().nullable(),
  wb_status: Yup.mixed().nullable(),
  created_at: Yup.date().default(() => new Date()),
  subscription: Yup.mixed().nullable(),
  catalog_settings: Yup.mixed().nullable(),
  is_migration: Yup.boolean().default(true),
  cloud_provider: Yup.string(),
  commands: Yup.array().of(
    Yup.object().shape({
      command_name: Yup.string().required(),
      command_description: Yup.string().required(),
    })
  ),
  prompts: Yup.mixed().nullable(),
});
