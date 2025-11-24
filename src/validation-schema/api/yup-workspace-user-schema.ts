import * as Yup from "yup";

export const yupStaffSchema = Yup.object().shape({
  permissions: Yup.object().shape({
    whatsapp_chat: Yup.boolean().default(true),
    instagram: Yup.boolean().default(true),
    web_chat: Yup.boolean().default(true),
    contact: Yup.boolean().default(true),
    broadcast: Yup.boolean().default(true),
    template: Yup.boolean().default(true),
    automation: Yup.boolean().default(true),
    ecommerce: Yup.boolean().default(true),
    integration: Yup.boolean().default(true),
    analytics: Yup.boolean().default(true),
    channel_whatsapp_profile: Yup.boolean().default(true),
    settings_general_operator: Yup.boolean().default(true),
    settings_general_wallet: Yup.boolean().default(true),
    settings_general_payment: Yup.boolean().default(true),
    settings_general_subscription: Yup.boolean().default(true),
    settings_general_developer: Yup.boolean().default(true),
    settings_general_tag: Yup.boolean().default(true),
  }),
});

export const yupWorkspaceUserSortSchema = Yup.object().shape({
  first_name: Yup.number().oneOf([1, -1]),
  created_at: Yup.number().oneOf([1, -1]),
  updated_at: Yup.number().oneOf([1, -1]),
})