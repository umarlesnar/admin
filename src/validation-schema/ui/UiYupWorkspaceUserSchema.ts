import * as Yup from "yup";

export const UiyupStaffSchema = Yup.object().shape({
  permissions: Yup.object().shape(
    Object.fromEntries(
      [
        "whatsapp_chat",
        "instagram",
        "web_chat",
        "contact",
        "broadcast",
        "template",
        "automation",
        "ecommerce",
        "ctwa",
        "whatsapp_flow",
        "integration",
        "analytics",
        "channel_whatsapp_profile",
        "channel_live_chat_profile",
        "channel_instagram_profile",
        "settings_general_kwic_agent",
        "settings_general_operator",
        "settings_general_wallet",
        "settings_general_payment",
        "settings_general_subscription",
        "settings_general_developer",
        "settings_general_attribute",
        "settings_general_webhook",
        "settings_general_tag",
        "settings_general_billing",
      ].map((key) => [key, Yup.boolean()])
    )
  ),
});
