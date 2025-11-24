import * as Yup from "yup";

export const yupWhatsappWebhookSubscriptionSchema = Yup.object().shape({
    override_callback_uri: Yup.string()
  .url("Invalid URL format")
  .required("Override callback URI is required"),
 verify_token: Yup.string().min(3).required("Verify token is required"),

});
